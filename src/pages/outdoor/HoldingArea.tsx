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
import { MapPin, CheckCircle, Clock, TruckIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  type HoldingAreaRecord,
} from "../../store/slices/holdingAreaSlice";

export function HoldingArea() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.holdingArea);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    batchID: "",
    crop: "",
    variety: "",
    quantity: "",
    location: "",
    daysinHolding: "",
    condition: "",
    dispatchDate: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<HoldingAreaRecord | null>(null);

  const stats = [
    { title: "Total Plants", value: records.reduce((sum, r) => sum + r.quantity, 0).toString(), icon: MapPin, trend: { value: "+5% this week", isPositive: true } },
    { title: "Ready to Dispatch", value: records.filter((r) => r.status === "completed").length.toString(), icon: TruckIcon },
    { title: "Pending", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Active Batches", value: records.filter((r) => r.status === "active").length.toString(), icon: CheckCircle },
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
    const newRecord: HoldingAreaRecord = {
      id: form.id,
      date: form.date,
      batchID: form.batchID,
      crop: form.crop,
      variety: form.variety,
      quantity: parseInt(form.quantity) || 0,
      location: form.location,
      daysinHolding: parseInt(form.daysinHolding) || 0,
      condition: form.condition,
      dispatchDate: form.dispatchDate,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    setForm({
      id: "",
      date: "",
      batchID: "",
      crop: "",
      variety: "",
      quantity: "",
      location: "",
      daysinHolding: "",
      condition: "",
      dispatchDate: "",
      status: "pending",
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: HoldingAreaRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      batchID: record.batchID,
      crop: record.crop,
      variety: record.variety,
      quantity: record.quantity.toString(),
      location: record.location,
      daysinHolding: record.daysinHolding.toString(),
      condition: record.condition,
      dispatchDate: record.dispatchDate,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord: HoldingAreaRecord = {
        id: form.id,
        date: form.date,
        batchID: form.batchID,
        crop: form.crop,
        variety: form.variety,
        quantity: parseInt(form.quantity) || 0,
        location: form.location,
        daysinHolding: parseInt(form.daysinHolding) || 0,
        condition: form.condition,
        dispatchDate: form.dispatchDate,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
      setForm({
        id: "",
        date: "",
        batchID: "",
        crop: "",
        variety: "",
        quantity: "",
        location: "",
        daysinHolding: "",
        condition: "",
        dispatchDate: "",
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
        batchID: "",
        crop: "",
        variety: "",
        quantity: "",
        location: "",
        daysinHolding: "",
        condition: "",
        dispatchDate: "",
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
      batchID: "",
      crop: "",
      variety: "",
      quantity: "",
      location: "",
      daysinHolding: "",
      condition: "",
      dispatchDate: "",
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
          <h1>Holding Area</h1>
          <p className="text-[#717182] mt-1">Manage plants awaiting dispatch</p>
        </div>
        <div className="flex gap-2">
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
              <SelectTrigger className="max-w-xs bg-white text-black">
                <SelectValue placeholder="Select batch code" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
                Add Holding Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Holding Area Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Record ID</Label>
                  <Input placeholder="HA-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input placeholder="SH-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
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
                  <Label>Variety</Label>
                  <Input placeholder="Enter variety" value={form.variety} onChange={(e) => setForm({...form, variety: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="1000" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={form.location} onValueChange={(v) => setForm({...form, location: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Zone A">Zone A</SelectItem>
                      <SelectItem value="Zone B">Zone B</SelectItem>
                      <SelectItem value="Zone C">Zone C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Days in Holding</Label>
                  <Input type="number" placeholder="5" value={form.daysinHolding} onChange={(e) => setForm({...form, daysinHolding: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({...form, condition: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dispatch Date</Label>
                  <Input type="date" value={form.dispatchDate} onChange={(e) => setForm({...form, dispatchDate: e.target.value})} />
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
                <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Quantity</TableHead>
                <TableHead className="font-bold text-[#333333]">Location</TableHead>
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
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.location}</TableCell>
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
            <DialogTitle>Edit Holding Area Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input placeholder="HA-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input placeholder="SH-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
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
              <Label>Variety</Label>
              <Input placeholder="Enter variety" value={form.variety} onChange={(e) => setForm({...form, variety: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="1000" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={form.location} onValueChange={(v) => setForm({...form, location: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Zone A">Zone A</SelectItem>
                  <SelectItem value="Zone B">Zone B</SelectItem>
                  <SelectItem value="Zone C">Zone C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Days in Holding</Label>
              <Input type="number" placeholder="5" value={form.daysinHolding} onChange={(e) => setForm({...form, daysinHolding: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setForm({...form, condition: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dispatch Date</Label>
              <Input type="date" value={form.dispatchDate} onChange={(e) => setForm({...form, dispatchDate: e.target.value})} />
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
