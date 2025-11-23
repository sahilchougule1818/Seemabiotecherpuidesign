import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import { Microscope, Layers, Timer, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
  type SubcultureRecord,
} from "../../store/slices/subcultureSlice";

export function Subculturing() {
  const dispatch = useAppDispatch();
  const { records, searchTerm, filterStatus, editingId } = useAppSelector((state) => state.subculture);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");

  const formRefs = {
    id: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    sourceID: useRef<HTMLInputElement>(null),
    crop: useRef<HTMLSelectElement>(null),
    variety: useRef<HTMLInputElement>(null),
    stage: useRef<HTMLSelectElement>(null),
    explants: useRef<HTMLInputElement>(null),
    mediaUsed: useRef<HTMLSelectElement>(null),
    technician: useRef<HTMLInputElement>(null),
    status: useRef<HTMLSelectElement>(null),
  };

  const [formData, setFormData] = useState({
    crop: "",
    stage: "",
    mediaUsed: "",
    status: "",
  });

  const [editingRecord, setEditingRecord] = useState<SubcultureRecord | null>(null);

  const stats = [
    { title: "Total Cultures", value: records.length.toString(), icon: Microscope, trend: { value: "+8% this week", isPositive: true } },
    { title: "Active Subcultures", value: records.filter((r) => r.status === "active").length.toString(), icon: Layers },
    { title: "Awaiting Transfer", value: records.filter((r) => r.status === "pending").length.toString(), icon: Timer },
    { title: "Contaminated", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: AlertTriangle },
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
    const newID = formRefs.id.current?.value || `SC-2024-${String(records.length + 1).padStart(3, '0')}`;
    const newRecord: SubcultureRecord = {
      id: newID,
      date: formRefs.date.current?.value || new Date().toISOString().split('T')[0],
      sourceID: formRefs.sourceID.current?.value || "",
      crop: formData.crop || "Banana",
      variety: formRefs.variety.current?.value || "",
      stage: formData.stage || "Stage 1",
      explants: parseInt(formRefs.explants.current?.value || "0") || 0,
      mediaUsed: formData.mediaUsed || "MS Medium",
      technician: formRefs.technician.current?.value || "Lab Technician",
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
    setFormData({ crop: "", stage: "", mediaUsed: "", status: "" });
  }, [dispatch, editingId, editingRecord, records.length, formData]);

  const handleEdit = useCallback((record: SubcultureRecord) => {
    setEditingRecord(record);
    dispatch(setEditingId(record.id));
    setFormData({
      crop: record.crop,
      stage: record.stage,
      mediaUsed: record.mediaUsed,
      status: record.status,
    });

    setTimeout(() => {
      if (formRefs.id.current) formRefs.id.current.value = record.id;
      if (formRefs.date.current) formRefs.date.current.value = record.date;
      if (formRefs.sourceID.current) formRefs.sourceID.current.value = record.sourceID;
      if (formRefs.crop.current) formRefs.crop.current.value = record.crop;
      if (formRefs.variety.current) formRefs.variety.current.value = record.variety;
      if (formRefs.stage.current) formRefs.stage.current.value = record.stage;
      if (formRefs.explants.current) formRefs.explants.current.value = record.explants.toString();
      if (formRefs.mediaUsed.current) formRefs.mediaUsed.current.value = record.mediaUsed;
      if (formRefs.technician.current) formRefs.technician.current.value = record.technician;
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
    setFormData({ crop: "", stage: "", mediaUsed: "", status: "" });
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilterStatus(filterValue));
  }, [filterValue, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Subculturing</h1>
          <p className="text-[#717182] mt-1">Track and manage plant tissue culture subculturing</p>
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
          <Dialog open={isAddModalOpen} onOpenChange={(open) => { if (!open) { handleCloseModal(); } else { setIsAddModalOpen(true); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="w-4 h-4" />
                Add Subculture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Subculture Record" : "Add New Subculture Record"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Subculture ID</Label>
                  <Input ref={formRefs.id} placeholder="SC-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input ref={formRefs.date} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Source ID</Label>
                  <Input ref={formRefs.sourceID} placeholder="MB-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select value={formData.crop} onValueChange={(v) => { setFormData(prev => ({ ...prev, crop: v })); if (formRefs.crop.current) formRefs.crop.current.value = v; }}>
                    <SelectTrigger ref={formRefs.crop as any} className="bg-white">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="bamboo">Bamboo</SelectItem>
                      <SelectItem value="teak">Teak</SelectItem>
                      <SelectItem value="ornamental">Ornamental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Variety</Label>
                  <Input ref={formRefs.variety} placeholder="Enter variety" />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={formData.stage} onValueChange={(v) => { setFormData(prev => ({ ...prev, stage: v })); if (formRefs.stage.current) formRefs.stage.current.value = v; }}>
                    <SelectTrigger ref={formRefs.stage as any} className="bg-white">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Stage 1">Stage 1</SelectItem>
                      <SelectItem value="Stage 2">Stage 2</SelectItem>
                      <SelectItem value="Stage 3">Stage 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Explants</Label>
                  <Input ref={formRefs.explants} type="number" placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label>Media Used</Label>
                  <Select value={formData.mediaUsed} onValueChange={(v) => { setFormData(prev => ({ ...prev, mediaUsed: v })); if (formRefs.mediaUsed.current) formRefs.mediaUsed.current.value = v; }}>
                    <SelectTrigger ref={formRefs.mediaUsed as any} className="bg-white">
                      <SelectValue placeholder="Select media" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="MS Medium">MS Medium</SelectItem>
                      <SelectItem value="WPM Medium">WPM Medium</SelectItem>
                      <SelectItem value="B5 Medium">B5 Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Technician</Label>
                  <Input ref={formRefs.technician} placeholder="Technician name" />
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
              placeholder="Search subcultures..."
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
          <h3>Subculturing Register</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Date</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Stage</TableHead>
                <TableHead className="font-bold text-[#333333]">Explants</TableHead>
                <TableHead className="font-bold text-[#333333]">Technician</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.stage}</TableCell>
                  <TableCell>{record.explants}</TableCell>
                  <TableCell>{record.technician}</TableCell>
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
