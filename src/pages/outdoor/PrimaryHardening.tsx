import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Download, Trash2, Edit2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { StatusBadge, StatusType } from "../../components/common/StatusBadge";
import { StatsCard } from "../../components/common/StatsCard";
import { Sprout, CheckCircle, Clock, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  type PrimaryHardeningRecord,
} from "../../store/slices/primaryHardeningSlice";

export function PrimaryHardening() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.primaryHardening);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    batchName: "",
    crop: "",
    tunnel: "",
    bed: "",
    row: "",
    cavity: "",
    plants: "",
    workers: "",
    waitingPeriod: "",
    status: "active" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<PrimaryHardeningRecord | null>(null);

  const totalPlants = records.reduce((sum, r) => sum + r.plants, 0);

  const stats = [
    { title: "Active Batches", value: records.filter((r) => r.status === "active").length.toString(), icon: Sprout, trend: { value: "+6 this week", isPositive: true } },
    { title: "Total Plants", value: totalPlants.toLocaleString(), icon: CheckCircle },
    { title: "Awaiting Transfer", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Completed Batches", value: records.filter((r) => r.status === "completed").length.toString(), icon: MapPin },
  ];

  const uniqueBatchCodes = useMemo(() => {
    const batches = new Set(records.map((r) => r.id));
    return Array.from(batches).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = Object.values(record).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter = filterValue === "all" || record.status === filterValue;
      const matchesBatch = !showFiltered || record.id === batchFilter;
      return matchesSearch && matchesFilter && matchesBatch;
    });
  }, [records, searchTerm, filterValue, batchFilter, showFiltered]);

  const handleAdd = () => {
    if (!form.id || !form.date || !form.batchName || !form.crop || !form.tunnel || !form.plants || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    const newRecord: PrimaryHardeningRecord = {
      id: form.id,
      date: form.date,
      batchName: form.batchName,
      crop: form.crop,
      tunnel: form.tunnel,
      bed: form.bed,
      row: form.row,
      cavity: form.cavity,
      plants: parseInt(form.plants) || 0,
      workers: parseInt(form.workers) || 0,
      waitingPeriod: form.waitingPeriod,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: PrimaryHardeningRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      batchName: record.batchName,
      crop: record.crop,
      tunnel: record.tunnel,
      bed: record.bed,
      row: record.row,
      cavity: record.cavity,
      plants: record.plants.toString(),
      workers: record.workers.toString(),
      waitingPeriod: record.waitingPeriod,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (!form.id || !form.date || !form.batchName || !form.crop || !form.tunnel || !form.plants || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    if (editingRecord) {
      const updatedRecord: PrimaryHardeningRecord = {
        id: form.id,
        date: form.date,
        batchName: form.batchName,
        crop: form.crop,
        tunnel: form.tunnel,
        bed: form.bed,
        row: form.row,
        cavity: form.cavity,
        plants: parseInt(form.plants) || 0,
        workers: parseInt(form.workers) || 0,
        waitingPeriod: form.waitingPeriod,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
      resetForm();
      setEditingRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteFromEdit = () => {
    if (editingRecord) {
      dispatch(deleteRecord(editingRecord.id));
      resetForm();
      setEditingRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteRecord(id));
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      id: "",
      date: "",
      batchName: "",
      crop: "",
      tunnel: "",
      bed: "",
      row: "",
      cavity: "",
      plants: "",
      workers: "",
      waitingPeriod: "",
      status: "active",
    });
  };

  const handleBatchFilter = () => {
    setShowFiltered(true);
  };

  const handleShowAllData = () => {
    setShowFiltered(false);
    setBatchFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Primary Hardening</h1>
          <p className="text-[#717182] mt-1">Manage plant acclimatization in controlled tunnels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select batch code" />
              </SelectTrigger>
              <SelectContent>
                {uniqueBatchCodes.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleBatchFilter} className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
            {showFiltered && (
              <Button onClick={handleShowAllData} variant="outline" className="gap-2">
                Show All Data
              </Button>
            )}
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                  <Plus className="w-4 h-4" />
                  Add Primary Hardening
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Primary Hardening Record</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Batch ID</Label>
                    <Input placeholder="PH-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Name</Label>
                    <Input placeholder="e.g., Banana-GN-Nov" value={form.batchName} onChange={(e) => setForm({...form, batchName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Crop Type</Label>
                    <Select value={form.crop} onValueChange={(v) => setForm({...form, crop: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Banana">Banana</SelectItem>
                        <SelectItem value="Bamboo">Bamboo</SelectItem>
                        <SelectItem value="Teak">Teak</SelectItem>
                        <SelectItem value="Ornamental">Ornamental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tunnel</Label>
                    <Select value={form.tunnel} onValueChange={(v) => setForm({...form, tunnel: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select tunnel" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="T1">T1</SelectItem>
                        <SelectItem value="T2">T2</SelectItem>
                        <SelectItem value="T3">T3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bed</Label>
                    <Select value={form.bed} onValueChange={(v) => setForm({...form, bed: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select bed" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="B3">B3</SelectItem>
                        <SelectItem value="B4">B4</SelectItem>
                        <SelectItem value="B5">B5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Row</Label>
                    <Input placeholder="e.g., R1-R5" value={form.row} onChange={(e) => setForm({...form, row: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cavity Size</Label>
                    <Input placeholder="50" value={form.cavity} onChange={(e) => setForm({...form, cavity: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Plants</Label>
                    <Input type="number" placeholder="2500" value={form.plants} onChange={(e) => setForm({...form, plants: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Workers</Label>
                    <Input type="number" placeholder="4" value={form.workers} onChange={(e) => setForm({...form, workers: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Waiting Period</Label>
                    <Input placeholder="e.g., 14 days" value={form.waitingPeriod} onChange={(e) => setForm({...form, waitingPeriod: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm({...form, status: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="contaminated">Contaminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { resetForm(); setIsAddModalOpen(false); }}>
                    Cancel
                  </Button>
                  <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleAdd}>
                    Save Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
        <div className="border rounded-lg overflow-hidden mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Date</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch Name</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Tunnel</TableHead>
                <TableHead className="font-bold text-[#333333]">Bed</TableHead>
                <TableHead className="font-bold text-[#333333]">Row</TableHead>
                <TableHead className="font-bold text-[#333333]">Cavity</TableHead>
                <TableHead className="font-bold text-[#333333]">Plants</TableHead>
                <TableHead className="font-bold text-[#333333]">Workers</TableHead>
                <TableHead className="font-bold text-[#333333]">Waiting</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.batchName}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.tunnel}</TableCell>
                  <TableCell>{record.bed}</TableCell>
                  <TableCell>{record.row}</TableCell>
                  <TableCell>{record.cavity}</TableCell>
                  <TableCell>{record.plants}</TableCell>
                  <TableCell>{record.workers}</TableCell>
                  <TableCell>{record.waitingPeriod}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Primary Hardening Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input placeholder="PH-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input placeholder="e.g., Banana-GN-Nov" value={form.batchName} onChange={(e) => setForm({...form, batchName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Select value={form.crop} onValueChange={(v) => setForm({...form, crop: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Banana">Banana</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                  <SelectItem value="Teak">Teak</SelectItem>
                  <SelectItem value="Ornamental">Ornamental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tunnel</Label>
              <Select value={form.tunnel} onValueChange={(v) => setForm({...form, tunnel: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select tunnel" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bed</Label>
              <Select value={form.bed} onValueChange={(v) => setForm({...form, bed: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select bed" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="B3">B3</SelectItem>
                  <SelectItem value="B4">B4</SelectItem>
                  <SelectItem value="B5">B5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Row</Label>
              <Input placeholder="e.g., R1-R5" value={form.row} onChange={(e) => setForm({...form, row: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cavity Size</Label>
              <Input placeholder="50" value={form.cavity} onChange={(e) => setForm({...form, cavity: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Number of Plants</Label>
              <Input type="number" placeholder="2500" value={form.plants} onChange={(e) => setForm({...form, plants: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Number of Workers</Label>
              <Input type="number" placeholder="4" value={form.workers} onChange={(e) => setForm({...form, workers: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Waiting Period</Label>
              <Input placeholder="e.g., 14 days" value={form.waitingPeriod} onChange={(e) => setForm({...form, waitingPeriod: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({...form, status: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="contaminated">Contaminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteFromEdit}>
              Delete Entry
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
