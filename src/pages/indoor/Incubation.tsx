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
import { Flame, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  type IncubationRecord,
} from "../../store/slices/incubationSlice";

export function Incubation() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.incubation);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    batchID: "",
    startDate: "",
    duration: "",
    temperature: "",
    light: "",
    humidity: "",
    chamber: "",
    observations: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<IncubationRecord | null>(null);

  const stats = [
    { title: "Total Incubating", value: records.length.toString(), icon: Flame, trend: { value: "+15 new entries", isPositive: true } },
    { title: "Optimal Conditions", value: records.filter((r) => r.status === "active").length.toString(), icon: CheckCircle },
    { title: "Monitoring Required", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Issues Detected", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: AlertTriangle },
  ];

  const uniqueBatchCodes = useMemo(() => {
    const batches = new Set(records.map((r) => r.batchID));
    return Array.from(batches).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesBatch = !showFiltered || record.batchID === batchFilter;
      return matchesBatch;
    });
  }, [records, batchFilter, showFiltered]);

  const handleAdd = () => {
    const newRecord: IncubationRecord = {
      id: form.id,
      batchID: form.batchID,
      startDate: form.startDate,
      duration: form.duration,
      temperature: form.temperature,
      light: form.light,
      humidity: form.humidity,
      chamber: form.chamber,
      observations: form.observations,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    setForm({
      id: "",
      batchID: "",
      startDate: "",
      duration: "",
      temperature: "",
      light: "",
      humidity: "",
      chamber: "",
      observations: "",
      status: "pending",
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: IncubationRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      batchID: record.batchID,
      startDate: record.startDate,
      duration: record.duration,
      temperature: record.temperature,
      light: record.light,
      humidity: record.humidity,
      chamber: record.chamber,
      observations: record.observations,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord: IncubationRecord = {
        id: form.id,
        batchID: form.batchID,
        startDate: form.startDate,
        duration: form.duration,
        temperature: form.temperature,
        light: form.light,
        humidity: form.humidity,
        chamber: form.chamber,
        observations: form.observations,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
      setForm({
        id: "",
        batchID: "",
        startDate: "",
        duration: "",
        temperature: "",
        light: "",
        humidity: "",
        chamber: "",
        observations: "",
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
        batchID: "",
        startDate: "",
        duration: "",
        temperature: "",
        light: "",
        humidity: "",
        chamber: "",
        observations: "",
        status: "pending",
      });
      setEditingRecord(null);
      setIsEditModalOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      id: "",
      batchID: "",
      startDate: "",
      duration: "",
      temperature: "",
      light: "",
      humidity: "",
      chamber: "",
      observations: "",
      status: "pending",
    });
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteRecord(id));
  }, [dispatch]);

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
            <Button onClick={handleBatchFilter} className="gap-2 bg-[#2196F3] hover:bg-[#1976D2] text-white">
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
                Add Incubation Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Incubation Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Incubation ID</Label>
                  <Input placeholder="INC-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input placeholder="SC-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input placeholder="14 days" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Input placeholder="25°C" value={form.temperature} onChange={(e) => setForm({...form, temperature: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Light</Label>
                  <Input placeholder="16h light/8h dark" value={form.light} onChange={(e) => setForm({...form, light: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Humidity</Label>
                  <Input placeholder="70%" value={form.humidity} onChange={(e) => setForm({...form, humidity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Chamber</Label>
                  <Select value={form.chamber} onValueChange={(v) => setForm({...form, chamber: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select chamber" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Chamber 1">Chamber 1</SelectItem>
                      <SelectItem value="Chamber 2">Chamber 2</SelectItem>
                      <SelectItem value="Chamber 3">Chamber 3</SelectItem>
                      <SelectItem value="Chamber 4">Chamber 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Observations</Label>
                  <Input placeholder="Enter observations" value={form.observations} onChange={(e) => setForm({...form, observations: e.target.value})} />
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
                <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Start Date</TableHead>
                <TableHead className="font-bold text-[#333333]">Duration</TableHead>
                <TableHead className="font-bold text-[#333333]">Chamber</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.batchID}</TableCell>
                  <TableCell>{record.startDate}</TableCell>
                  <TableCell>{record.duration}</TableCell>
                  <TableCell>{record.chamber}</TableCell>
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
            <DialogTitle>Edit Incubation Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Incubation ID</Label>
              <Input placeholder="INC-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input placeholder="SC-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input placeholder="14 days" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input placeholder="25°C" value={form.temperature} onChange={(e) => setForm({...form, temperature: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Light</Label>
              <Input placeholder="16h light/8h dark" value={form.light} onChange={(e) => setForm({...form, light: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Humidity</Label>
              <Input placeholder="70%" value={form.humidity} onChange={(e) => setForm({...form, humidity: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Chamber</Label>
              <Select value={form.chamber} onValueChange={(v) => setForm({...form, chamber: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select chamber" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Chamber 1">Chamber 1</SelectItem>
                  <SelectItem value="Chamber 2">Chamber 2</SelectItem>
                  <SelectItem value="Chamber 3">Chamber 3</SelectItem>
                  <SelectItem value="Chamber 4">Chamber 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Observations</Label>
              <Input placeholder="Enter observations" value={form.observations} onChange={(e) => setForm({...form, observations: e.target.value})} />
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
