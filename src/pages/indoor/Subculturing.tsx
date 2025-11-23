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
import { Microscope, Layers, Timer, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  type SubcultureRecord,
} from "../../store/slices/subcultureSlice";

export function Subculturing() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.subculture);
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    sourceID: "",
    crop: "",
    variety: "",
    stage: "",
    explants: "",
    mediaUsed: "",
    technician: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<SubcultureRecord | null>(null);

  const stats = [
    { title: "Total Cultures", value: records.length.toString(), icon: Microscope, trend: { value: "+8% this week", isPositive: true } },
    { title: "Active Subcultures", value: records.filter((r) => r.status === "active").length.toString(), icon: Layers },
    { title: "Awaiting Transfer", value: records.filter((r) => r.status === "pending").length.toString(), icon: Timer },
    { title: "Contaminated", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: AlertTriangle },
  ];

  const uniqueBatchCodes = useMemo(() => {
    const batches = new Set<string>();
    records.forEach((record) => batches.add(record.id));
    return Array.from(batches).sort();
  }, [records]);

  const handleBatchFilter = () => {
    if (batchFilter) {
      setShowFiltered(true);
    }
  };

  const handleShowAllData = () => {
    setShowFiltered(false);
    setBatchFilter("");
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesBatch = !showFiltered || record.id === batchFilter;
      return matchesBatch;
    });
  }, [records, batchFilter, showFiltered]);

  const handleAdd = () => {
    const newRecord: SubcultureRecord = {
      id: form.id,
      date: form.date,
      sourceID: form.sourceID,
      crop: form.crop,
      variety: form.variety,
      stage: form.stage,
      explants: parseInt(form.explants) || 0,
      mediaUsed: form.mediaUsed,
      technician: form.technician,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    setForm({
      id: "",
      date: "",
      sourceID: "",
      crop: "",
      variety: "",
      stage: "",
      explants: "",
      mediaUsed: "",
      technician: "",
      status: "pending",
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: SubcultureRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      sourceID: record.sourceID,
      crop: record.crop,
      variety: record.variety,
      stage: record.stage,
      explants: record.explants.toString(),
      mediaUsed: record.mediaUsed,
      technician: record.technician,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord: SubcultureRecord = {
        id: form.id,
        date: form.date,
        sourceID: form.sourceID,
        crop: form.crop,
        variety: form.variety,
        stage: form.stage,
        explants: parseInt(form.explants) || 0,
        mediaUsed: form.mediaUsed,
        technician: form.technician,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
      setForm({
        id: "",
        date: "",
        sourceID: "",
        crop: "",
        variety: "",
        stage: "",
        explants: "",
        mediaUsed: "",
        technician: "",
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
        sourceID: "",
        crop: "",
        variety: "",
        stage: "",
        explants: "",
        mediaUsed: "",
        technician: "",
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
      sourceID: "",
      crop: "",
      variety: "",
      stage: "",
      explants: "",
      mediaUsed: "",
      technician: "",
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
                Add Subculture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Subculture Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Subculture ID</Label>
                  <Input placeholder="SC-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Source ID</Label>
                  <Input placeholder="MB-2024-XXX" value={form.sourceID} onChange={(e) => setForm({...form, sourceID: e.target.value})} />
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
                  <Label>Variety</Label>
                  <Input placeholder="Enter variety" value={form.variety} onChange={(e) => setForm({...form, variety: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                    <SelectTrigger className="bg-white">
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
                  <Input type="number" placeholder="25" value={form.explants} onChange={(e) => setForm({...form, explants: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Media Used</Label>
                  <Select value={form.mediaUsed} onValueChange={(v) => setForm({...form, mediaUsed: v})}>
                    <SelectTrigger className="bg-white">
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
                  <Input placeholder="Technician name" value={form.technician} onChange={(e) => setForm({...form, technician: e.target.value})} />
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subculture Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Subculture ID</Label>
              <Input placeholder="SC-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Source ID</Label>
              <Input placeholder="MB-2024-XXX" value={form.sourceID} onChange={(e) => setForm({...form, sourceID: e.target.value})} />
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
              <Label>Variety</Label>
              <Input placeholder="Enter variety" value={form.variety} onChange={(e) => setForm({...form, variety: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                <SelectTrigger className="bg-white">
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
              <Input type="number" placeholder="25" value={form.explants} onChange={(e) => setForm({...form, explants: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Media Used</Label>
              <Select value={form.mediaUsed} onValueChange={(v) => setForm({...form, mediaUsed: v})}>
                <SelectTrigger className="bg-white">
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
              <Input placeholder="Technician name" value={form.technician} onChange={(e) => setForm({...form, technician: e.target.value})} />
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
