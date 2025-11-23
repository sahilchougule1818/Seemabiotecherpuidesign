import { useState, useMemo, useCallback, useRef } from "react";
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
import { TreePine, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
  type SecondaryHardeningRecord,
} from "../../store/slices/secondaryHardeningSlice";

export function SecondaryHardening() {
  const dispatch = useAppDispatch();
  const { records, searchTerm, filterStatus, editingId } = useAppSelector((state) => state.secondaryHardening);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [editingRecord, setEditingRecord] = useState<SecondaryHardeningRecord | null>(null);
  const [formData, setFormData] = useState({
    crop: "",
    tunnel: "",
    bed: "",
    status: "",
  });

  const formRefs = {
    id: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    batchName: useRef<HTMLInputElement>(null),
    crop: useRef<HTMLSelectElement>(null),
    tunnel: useRef<HTMLSelectElement>(null),
    bed: useRef<HTMLSelectElement>(null),
    row: useRef<HTMLInputElement>(null),
    cavity: useRef<HTMLInputElement>(null),
    plants: useRef<HTMLInputElement>(null),
    workers: useRef<HTMLInputElement>(null),
    waitingPeriod: useRef<HTMLInputElement>(null),
    survivability: useRef<HTMLInputElement>(null),
    status: useRef<HTMLSelectElement>(null),
  };

  const stats = [
    { title: "Active Batches", value: records.length.toString(), icon: TreePine, trend: { value: "+4 this week", isPositive: true } },
    { title: "Ready for Dispatch", value: records.filter((r) => r.status === "completed").length.toString(), icon: CheckCircle },
    { title: "In Progress", value: records.filter((r) => r.status === "active").length.toString(), icon: Clock },
    { title: "Monitoring Required", value: records.filter((r) => r.status === "pending").length.toString(), icon: AlertCircle },
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

  const handleAdd = useCallback(() => {
    const newRecord: SecondaryHardeningRecord = {
      id: formRefs.id.current?.value || `SH-2024-${String(records.length + 1).padStart(3, '0')}`,
      date: formRefs.date.current?.value || new Date().toISOString().split('T')[0],
      batchName: formRefs.batchName.current?.value || "",
      crop: formData.crop || "Banana",
      tunnel: formData.tunnel || "Tunnel 1",
      bed: formData.bed || "Bed 1",
      row: formRefs.row.current?.value || "1",
      cavity: formRefs.cavity.current?.value || "50",
      plants: parseInt(formRefs.plants.current?.value || "0") || 0,
      workers: parseInt(formRefs.workers.current?.value || "0") || 0,
      waitingPeriod: formRefs.waitingPeriod.current?.value || "7 days",
      survivability: formRefs.survivability.current?.value || "95%",
      status: (formData.status || "pending") as StatusType,
    };

    if (editingId && editingRecord) {
      dispatch(updateRecord({ ...newRecord, id: editingRecord.id }));
      dispatch(setEditingId(null));
      setEditingRecord(null);
    } else {
      dispatch(addRecord(newRecord));
    }

    setIsAddModalOpen(false);
    Object.values(formRefs).forEach((ref) => {
      if (ref.current && 'value' in ref.current) ref.current.value = "";
    });
    setFormData({ crop: "", tunnel: "", bed: "", status: "" });
  }, [dispatch, editingId, editingRecord, records.length, formData]);

  const handleEdit = useCallback((record: SecondaryHardeningRecord) => {
    setEditingRecord(record);
    dispatch(setEditingId(record.id));
    setFormData({
      crop: record.crop,
      tunnel: record.tunnel,
      bed: record.bed,
      status: record.status,
    });

    setTimeout(() => {
      if (formRefs.id.current) formRefs.id.current.value = record.id;
      if (formRefs.date.current) formRefs.date.current.value = record.date;
      if (formRefs.batchName.current) formRefs.batchName.current.value = record.batchName;
      if (formRefs.crop.current) formRefs.crop.current.value = record.crop;
      if (formRefs.tunnel.current) formRefs.tunnel.current.value = record.tunnel;
      if (formRefs.bed.current) formRefs.bed.current.value = record.bed;
      if (formRefs.row.current) formRefs.row.current.value = record.row;
      if (formRefs.cavity.current) formRefs.cavity.current.value = record.cavity;
      if (formRefs.plants.current) formRefs.plants.current.value = record.plants.toString();
      if (formRefs.workers.current) formRefs.workers.current.value = record.workers.toString();
      if (formRefs.waitingPeriod.current) formRefs.waitingPeriod.current.value = record.waitingPeriod;
      if (formRefs.survivability.current) formRefs.survivability.current.value = record.survivability;
      if (formRefs.status.current) formRefs.status.current.value = record.status;
    }, 0);

    setIsAddModalOpen(true);
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteRecord(id));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    setIsAddModalOpen(false);
    dispatch(setEditingId(null));
    setEditingRecord(null);
    Object.values(formRefs).forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
    setFormData({ crop: "", tunnel: "", bed: "", status: "" });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Secondary Hardening</h1>
          <p className="text-[#717182] mt-1">Final acclimatization before dispatch to field</p>
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
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="w-4 h-4" />
                Add Secondary Hardening
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Record" : "Add Secondary Hardening Record"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input ref={formRefs.date} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch Name</Label>
                  <Input ref={formRefs.batchName} placeholder="e.g., Banana-GN-Oct" />
                </div>
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select value={formData.crop} onValueChange={(v) => { setFormData(prev => ({ ...prev, crop: v })); if (formRefs.crop.current) formRefs.crop.current.value = v; }}>
                    <SelectTrigger ref={formRefs.crop as any} className="bg-white">
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
                  <Select value={formData.tunnel} onValueChange={(v) => { setFormData(prev => ({ ...prev, tunnel: v })); if (formRefs.tunnel.current) formRefs.tunnel.current.value = v; }}>
                    <SelectTrigger ref={formRefs.tunnel as any} className="bg-white">
                      <SelectValue placeholder="Select tunnel" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="SH-T1">SH-T1</SelectItem>
                      <SelectItem value="SH-T2">SH-T2</SelectItem>
                      <SelectItem value="SH-T3">SH-T3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bed</Label>
                  <Select value={formData.bed} onValueChange={(v) => { setFormData(prev => ({ ...prev, bed: v })); if (formRefs.bed.current) formRefs.bed.current.value = v; }}>
                    <SelectTrigger ref={formRefs.bed as any} className="bg-white">
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="SB1">SB1</SelectItem>
                      <SelectItem value="SB2">SB2</SelectItem>
                      <SelectItem value="SB3">SB3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Row</Label>
                  <Input ref={formRefs.row} placeholder="e.g., SR1-SR4" />
                </div>
                <div className="space-y-2">
                  <Label>Cavity Size</Label>
                  <Input ref={formRefs.cavity} type="number" placeholder="72" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Plants</Label>
                  <Input ref={formRefs.plants} type="number" placeholder="2000" />
                </div>
                <div className="space-y-2">
                  <Label>Workers</Label>
                  <Input ref={formRefs.workers} type="number" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label>Waiting Period</Label>
                  <Input ref={formRefs.waitingPeriod} placeholder="21 days" />
                </div>
                <div className="space-y-2">
                  <Label>Survivability %</Label>
                  <Input ref={formRefs.survivability} placeholder="96%" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => { setFormData(prev => ({ ...prev, status: v })); if (formRefs.status.current) formRefs.status.current.value = v; }}>
                    <SelectTrigger ref={formRefs.status as any} className="bg-white">
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
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleAdd}>
                  {editingId ? "Update" : "Save"} Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
              placeholder="Search secondary hardening..."
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
          <h3>Secondary Hardening Register</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch Name</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Tunnel</TableHead>
                <TableHead className="font-bold text-[#333333]">Plants</TableHead>
                <TableHead className="font-bold text-[#333333]">Survival %</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.batchName}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.tunnel}</TableCell>
                  <TableCell>{record.plants}</TableCell>
                  <TableCell>{record.survivability}</TableCell>
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
    </div>
  );
}
