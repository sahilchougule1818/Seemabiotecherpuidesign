import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Download, Trash2, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { StatusBadge, StatusType } from "../../components/common/StatusBadge";
import { StatsCard } from "../../components/common/StatsCard";
import { Sprout, TrendingUp, Users, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  type SecondaryHardeningRecord,
} from "../../store/slices/secondaryHardeningSlice";

export function SecondaryHardening() {
  const dispatch = useAppDispatch();
  const { records, searchTerm } = useAppSelector((state) => state.secondaryHardening);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");

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
    survivability: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<SecondaryHardeningRecord | null>(null);

  const stats = [
    { title: "Total Plants", value: records.reduce((sum, r) => sum + r.plants, 0).toString(), icon: Sprout, trend: { value: "+12% this week", isPositive: true } },
    { title: "Active Batches", value: records.filter((r) => r.status === "active").length.toString(), icon: TrendingUp },
    { title: "Total Workers", value: records.reduce((sum, r) => sum + r.workers, 0).toString(), icon: Users },
    { title: "Avg Survivability", value: `${Math.round(records.reduce((sum, r) => sum + parseFloat(r.survivability), 0) / records.length) || 0}%`, icon: Award },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = Object.values(record).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter = filterValue === "all" || record.status === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [records, searchTerm, filterValue]);

  const handleAdd = () => {
    const newRecord: SecondaryHardeningRecord = {
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
      survivability: form.survivability,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
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
      survivability: "",
      status: "pending",
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: SecondaryHardeningRecord) => {
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
      survivability: record.survivability,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord: SecondaryHardeningRecord = {
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
        survivability: form.survivability,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
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
        survivability: "",
        status: "pending",
      });
      setEditingRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteFromEdit = () => {
    if (editingRecord) {
      dispatch(deleteRecord(editingRecord.id));
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
        survivability: "",
        status: "pending",
      });
      setEditingRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const handleCancelEdit = () => {
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
      survivability: "",
      status: "pending",
    });
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteRecord(id));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Secondary Hardening</h1>
          <p className="text-[#717182] mt-1">Track plants in outdoor acclimatization tunnels</p>
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
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search hardening records..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <Select value={filterValue} onValueChange={(v) => setFilterValue(v as StatusType | "all")}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="contaminated">Contaminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="w-4 h-4" />
                Add Hardening Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Secondary Hardening Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Record ID</Label>
                  <Input placeholder="SH-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Batch Name</Label>
                  <Input placeholder="Enter batch name" value={form.batchName} onChange={(e) => setForm({...form, batchName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Crop</Label>
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
                      <SelectItem value="Tunnel 1">Tunnel 1</SelectItem>
                      <SelectItem value="Tunnel 2">Tunnel 2</SelectItem>
                      <SelectItem value="Tunnel 3">Tunnel 3</SelectItem>
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
                      <SelectItem value="Bed 1">Bed 1</SelectItem>
                      <SelectItem value="Bed 2">Bed 2</SelectItem>
                      <SelectItem value="Bed 3">Bed 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Row</Label>
                  <Input placeholder="1" value={form.row} onChange={(e) => setForm({...form, row: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Cavity</Label>
                  <Input placeholder="50" value={form.cavity} onChange={(e) => setForm({...form, cavity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Plants</Label>
                  <Input type="number" placeholder="100" value={form.plants} onChange={(e) => setForm({...form, plants: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Workers</Label>
                  <Input type="number" placeholder="5" value={form.workers} onChange={(e) => setForm({...form, workers: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Waiting Period</Label>
                  <Input placeholder="7 days" value={form.waitingPeriod} onChange={(e) => setForm({...form, waitingPeriod: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Survivability (%)</Label>
                  <Input placeholder="95%" value={form.survivability} onChange={(e) => setForm({...form, survivability: e.target.value})} />
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
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
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
                <TableHead className="font-bold text-[#333333]">Batch</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Tunnel/Bed</TableHead>
                <TableHead className="font-bold text-[#333333]">Plants</TableHead>
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
                  <TableCell>{record.tunnel}/{record.bed}</TableCell>
                  <TableCell>{record.plants}</TableCell>
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
            <DialogTitle>Edit Secondary Hardening Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input placeholder="SH-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input placeholder="Enter batch name" value={form.batchName} onChange={(e) => setForm({...form, batchName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Crop</Label>
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
                  <SelectItem value="Tunnel 1">Tunnel 1</SelectItem>
                  <SelectItem value="Tunnel 2">Tunnel 2</SelectItem>
                  <SelectItem value="Tunnel 3">Tunnel 3</SelectItem>
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
                  <SelectItem value="Bed 1">Bed 1</SelectItem>
                  <SelectItem value="Bed 2">Bed 2</SelectItem>
                  <SelectItem value="Bed 3">Bed 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Row</Label>
              <Input placeholder="1" value={form.row} onChange={(e) => setForm({...form, row: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cavity</Label>
              <Input placeholder="50" value={form.cavity} onChange={(e) => setForm({...form, cavity: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Number of Plants</Label>
              <Input type="number" placeholder="100" value={form.plants} onChange={(e) => setForm({...form, plants: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Workers</Label>
              <Input type="number" placeholder="5" value={form.workers} onChange={(e) => setForm({...form, workers: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Waiting Period</Label>
              <Input placeholder="7 days" value={form.waitingPeriod} onChange={(e) => setForm({...form, waitingPeriod: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Survivability (%)</Label>
              <Input placeholder="95%" value={form.survivability} onChange={(e) => setForm({...form, survivability: e.target.value})} />
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
