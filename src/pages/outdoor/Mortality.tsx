import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Download, TrendingDown, Trash2, Edit2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { StatusBadge, StatusType } from "../../components/common/StatusBadge";
import { StatsCard } from "../../components/common/StatsCard";
import { Droplets, AlertTriangle, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  type MortalityRecord,
} from "../../store/slices/mortalitySlice";

export function Mortality() {
  const dispatch = useAppDispatch();
  const { records, searchTerm } = useAppSelector((state) => state.mortality);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    batchID: "",
    crop: "",
    stage: "",
    initialCount: "",
    mortality: "",
    mortalityRate: "",
    cause: "",
    action: "",
    status: "active" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<MortalityRecord | null>(null);

  const totalMortality = records.reduce((sum, r) => sum + r.mortality, 0);
  const totalInitial = records.reduce((sum, r) => sum + r.initialCount, 0);
  const avgMortalityRate = totalInitial > 0 ? ((totalMortality / totalInitial) * 100).toFixed(1) + "%" : "0%";

  const stats = [
    { title: "Total Mortality", value: totalMortality.toString(), icon: Droplets },
    { title: "Mortality Rate", value: avgMortalityRate, icon: TrendingDown, trend: { value: "-0.5% vs last month", isPositive: true } },
    { title: "Critical Batches", value: records.filter((r) => parseFloat(r.mortalityRate) > 5).length.toString(), icon: AlertTriangle },
    { title: "Within Limit", value: records.filter((r) => parseFloat(r.mortalityRate) <= 5 && r.status !== "contaminated").length.toString(), icon: CheckCircle },
  ];

  const uniqueBatchCodes = useMemo(() => {
    const batches = new Set(records.map((r) => r.batchID));
    return Array.from(batches).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = Object.values(record).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter = filterValue === "all" || record.status === filterValue;
      const matchesBatch = !showFiltered || record.batchID === batchFilter;
      return matchesSearch && matchesFilter && matchesBatch;
    });
  }, [records, searchTerm, filterValue, batchFilter, showFiltered]);

  const calculateMortalityRate = (initial: number, mortality: number) => {
    if (initial === 0) return "0%";
    return ((mortality / initial) * 100).toFixed(1) + "%";
  };

  const handleAdd = () => {
    if (!form.id || !form.date || !form.batchID || !form.crop || !form.stage || !form.initialCount || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    const initialCount = parseInt(form.initialCount) || 0;
    const mortality = parseInt(form.mortality) || 0;
    const newRecord: MortalityRecord = {
      id: form.id,
      date: form.date,
      batchID: form.batchID,
      crop: form.crop,
      stage: form.stage,
      initialCount: initialCount,
      mortality: mortality,
      mortalityRate: calculateMortalityRate(initialCount, mortality),
      cause: form.cause,
      action: form.action,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: MortalityRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      batchID: record.batchID,
      crop: record.crop,
      stage: record.stage,
      initialCount: record.initialCount.toString(),
      mortality: record.mortality.toString(),
      mortalityRate: record.mortalityRate,
      cause: record.cause,
      action: record.action,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (!form.id || !form.date || !form.batchID || !form.crop || !form.stage || !form.initialCount || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    if (editingRecord) {
      const initialCount = parseInt(form.initialCount) || 0;
      const mortality = parseInt(form.mortality) || 0;
      const updatedRecord: MortalityRecord = {
        id: form.id,
        date: form.date,
        batchID: form.batchID,
        crop: form.crop,
        stage: form.stage,
        initialCount: initialCount,
        mortality: mortality,
        mortalityRate: calculateMortalityRate(initialCount, mortality),
        cause: form.cause,
        action: form.action,
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
      batchID: "",
      crop: "",
      stage: "",
      initialCount: "",
      mortality: "",
      mortalityRate: "",
      cause: "",
      action: "",
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
          <h1>Mortality Tracking</h1>
          <p className="text-[#717182] mt-1">Monitor and analyze plant loss across batches</p>
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
        <div className="space-y-4">
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
            <Button onClick={handleShowAllData} variant="outline" className="gap-2">
              Show All Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search mortality records..."
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
                  Add Mortality Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Mortality Record</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Record ID</Label>
                    <Input placeholder="MR-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch ID</Label>
                    <Input placeholder="PH-2024-XXX or SH-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
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
                    <Label>Stage</Label>
                    <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Primary">Primary Hardening</SelectItem>
                        <SelectItem value="Secondary">Secondary Hardening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Plant Count</Label>
                    <Input type="number" placeholder="2500" value={form.initialCount} onChange={(e) => setForm({...form, initialCount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mortality Count</Label>
                    <Input type="number" placeholder="80" value={form.mortality} onChange={(e) => setForm({...form, mortality: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cause of Mortality</Label>
                    <Select value={form.cause} onValueChange={(v) => setForm({...form, cause: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select cause" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Transplant shock">Transplant shock</SelectItem>
                        <SelectItem value="Fungal infection">Fungal infection</SelectItem>
                        <SelectItem value="Bacterial infection">Bacterial infection</SelectItem>
                        <SelectItem value="Environmental stress">Environmental stress</SelectItem>
                        <SelectItem value="Normal attrition">Normal attrition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm({...form, status: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active Monitoring</SelectItem>
                        <SelectItem value="completed">Resolved</SelectItem>
                        <SelectItem value="contaminated">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Action Taken</Label>
                    <Textarea placeholder="Describe corrective actions..." rows={3} value={form.action} onChange={(e) => setForm({...form, action: e.target.value})} />
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
        </div>
        <div className="border rounded-lg overflow-hidden mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">Record ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Date</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Stage</TableHead>
                <TableHead className="font-bold text-[#333333]">Initial Count</TableHead>
                <TableHead className="font-bold text-[#333333]">Mortality</TableHead>
                <TableHead className="font-bold text-[#333333]">Rate</TableHead>
                <TableHead className="font-bold text-[#333333]">Cause</TableHead>
                <TableHead className="font-bold text-[#333333]">Action</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.batchID}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.stage}</TableCell>
                  <TableCell>{record.initialCount}</TableCell>
                  <TableCell>{record.mortality}</TableCell>
                  <TableCell>
                    <span className={parseFloat(record.mortalityRate) > 5 ? "text-[#d4183d]" : "text-[#4CAF50]"}>
                      {record.mortalityRate}
                    </span>
                  </TableCell>
                  <TableCell>{record.cause}</TableCell>
                  <TableCell>{record.action}</TableCell>
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
            <DialogTitle>Edit Mortality Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input placeholder="MR-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input placeholder="PH-2024-XXX or SH-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
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
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Primary">Primary Hardening</SelectItem>
                  <SelectItem value="Secondary">Secondary Hardening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Initial Plant Count</Label>
              <Input type="number" placeholder="2500" value={form.initialCount} onChange={(e) => setForm({...form, initialCount: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Mortality Count</Label>
              <Input type="number" placeholder="80" value={form.mortality} onChange={(e) => setForm({...form, mortality: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cause of Mortality</Label>
              <Select value={form.cause} onValueChange={(v) => setForm({...form, cause: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select cause" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Transplant shock">Transplant shock</SelectItem>
                  <SelectItem value="Fungal infection">Fungal infection</SelectItem>
                  <SelectItem value="Bacterial infection">Bacterial infection</SelectItem>
                  <SelectItem value="Environmental stress">Environmental stress</SelectItem>
                  <SelectItem value="Normal attrition">Normal attrition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({...form, status: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active Monitoring</SelectItem>
                  <SelectItem value="completed">Resolved</SelectItem>
                  <SelectItem value="contaminated">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Action Taken</Label>
              <Textarea placeholder="Describe corrective actions..." rows={3} value={form.action} onChange={(e) => setForm({...form, action: e.target.value})} />
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
