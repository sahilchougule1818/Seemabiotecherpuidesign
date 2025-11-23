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
import { Flame, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
  type IncubationRecord,
} from "../../store/slices/incubationSlice";

export function Incubation() {
  const dispatch = useAppDispatch();
  const { records, searchTerm, filterStatus, editingId } = useAppSelector((state) => state.incubation);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [editingRecord, setEditingRecord] = useState<IncubationRecord | null>(null);
  const [formData, setFormData] = useState({
    chamber: "",
    status: "",
  });

  const formRefs = {
    id: useRef<HTMLInputElement>(null),
    batchID: useRef<HTMLInputElement>(null),
    startDate: useRef<HTMLInputElement>(null),
    duration: useRef<HTMLInputElement>(null),
    temperature: useRef<HTMLInputElement>(null),
    light: useRef<HTMLInputElement>(null),
    humidity: useRef<HTMLInputElement>(null),
    chamber: useRef<HTMLSelectElement>(null),
    observations: useRef<HTMLInputElement>(null),
    status: useRef<HTMLSelectElement>(null),
  };

  const stats = [
    { title: "Total Incubating", value: records.length.toString(), icon: Flame, trend: { value: "+15 new entries", isPositive: true } },
    { title: "Optimal Conditions", value: records.filter((r) => r.status === "active").length.toString(), icon: CheckCircle },
    { title: "Monitoring Required", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Issues Detected", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: AlertTriangle },
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
    const newRecord: IncubationRecord = {
      id: formRefs.id.current?.value || `INC-2024-${String(records.length + 1).padStart(3, '0')}`,
      batchID: formRefs.batchID.current?.value || "",
      startDate: formRefs.startDate.current?.value || new Date().toISOString().split('T')[0],
      duration: formRefs.duration.current?.value || "14 days",
      temperature: formRefs.temperature.current?.value || "25°C",
      light: formRefs.light.current?.value || "16h light/8h dark",
      humidity: formRefs.humidity.current?.value || "70%",
      chamber: formData.chamber || "Chamber 1",
      observations: formRefs.observations.current?.value || "",
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
    setFormData({ chamber: "", status: "" });
  }, [dispatch, editingId, editingRecord, records.length, formData]);

  const handleEdit = useCallback((record: IncubationRecord) => {
    setEditingRecord(record);
    dispatch(setEditingId(record.id));
    setFormData({
      chamber: record.chamber,
      status: record.status,
    });

    setTimeout(() => {
      if (formRefs.id.current) formRefs.id.current.value = record.id;
      if (formRefs.batchID.current) formRefs.batchID.current.value = record.batchID;
      if (formRefs.startDate.current) formRefs.startDate.current.value = record.startDate;
      if (formRefs.duration.current) formRefs.duration.current.value = record.duration;
      if (formRefs.temperature.current) formRefs.temperature.current.value = record.temperature;
      if (formRefs.light.current) formRefs.light.current.value = record.light;
      if (formRefs.humidity.current) formRefs.humidity.current.value = record.humidity;
      if (formRefs.chamber.current) formRefs.chamber.current.value = record.chamber;
      if (formRefs.observations.current) formRefs.observations.current.value = record.observations;
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
    setFormData({ chamber: "", status: "" });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Incubation</h1>
          <p className="text-[#717182] mt-1">Monitor environmental conditions and growth progress</p>
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
                Add Incubation Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Incubation Record" : "Add Incubation Record"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Incubation ID</Label>
                  <Input ref={formRefs.id} placeholder="INC-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input ref={formRefs.batchID} placeholder="SC-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input ref={formRefs.startDate} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input ref={formRefs.duration} placeholder="14 days" />
                </div>
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Input ref={formRefs.temperature} placeholder="25°C" />
                </div>
                <div className="space-y-2">
                  <Label>Light Cycle</Label>
                  <Input ref={formRefs.light} placeholder="16h/day" />
                </div>
                <div className="space-y-2">
                  <Label>Humidity</Label>
                  <Input ref={formRefs.humidity} placeholder="60%" />
                </div>
                <div className="space-y-2">
                  <Label>Incubation Chamber</Label>
                  <Select value={formData.chamber} onValueChange={(v) => { setFormData(prev => ({ ...prev, chamber: v })); if (formRefs.chamber.current) formRefs.chamber.current.value = v; }}>
                    <SelectTrigger ref={formRefs.chamber as any} className="bg-white">
                      <SelectValue placeholder="Select chamber" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="IC-01">IC-01</SelectItem>
                      <SelectItem value="IC-02">IC-02</SelectItem>
                      <SelectItem value="IC-03">IC-03</SelectItem>
                      <SelectItem value="IC-04">IC-04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Observations</Label>
                  <Input ref={formRefs.observations} placeholder="Enter observations" />
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
              placeholder="Search incubation..."
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
          <h3>Incubation Register</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch</TableHead>
                <TableHead className="font-bold text-[#333333]">Temperature</TableHead>
                <TableHead className="font-bold text-[#333333]">Humidity</TableHead>
                <TableHead className="font-bold text-[#333333]">Chamber</TableHead>
                <TableHead className="font-bold text-[#333333]">Observations</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.batchID}</TableCell>
                  <TableCell>{record.temperature}</TableCell>
                  <TableCell>{record.humidity}</TableCell>
                  <TableCell>{record.chamber}</TableCell>
                  <TableCell>{record.observations}</TableCell>
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
