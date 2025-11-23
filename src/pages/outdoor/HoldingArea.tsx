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
import { MapPin, CheckCircle, Clock, TruckIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
  type HoldingAreaRecord,
} from "../../store/slices/holdingAreaSlice";

export function HoldingArea() {
  const dispatch = useAppDispatch();
  const { records, searchTerm, filterStatus, editingId } = useAppSelector((state) => state.holdingArea);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [editingRecord, setEditingRecord] = useState<HoldingAreaRecord | null>(null);
  const [formData, setFormData] = useState({
    crop: "",
    location: "",
    condition: "",
    status: "",
  });

  const formRefs = {
    id: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    batchID: useRef<HTMLInputElement>(null),
    crop: useRef<HTMLSelectElement>(null),
    variety: useRef<HTMLInputElement>(null),
    quantity: useRef<HTMLInputElement>(null),
    location: useRef<HTMLSelectElement>(null),
    condition: useRef<HTMLSelectElement>(null),
    dispatchDate: useRef<HTMLInputElement>(null),
    status: useRef<HTMLSelectElement>(null),
  };

  const stats = [
    { title: "Plants in Holding", value: records.reduce((sum, r) => sum + r.quantity, 0).toString(), icon: MapPin },
    { title: "Ready for Dispatch", value: records.filter((r) => r.status === "completed").length.toString(), icon: CheckCircle },
    { title: "Pending QC", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Dispatched Today", value: records.filter((r) => r.status === "active").length.toString(), icon: TruckIcon, trend: { value: "+200 vs yesterday", isPositive: true } },
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
    const newRecord: HoldingAreaRecord = {
      id: formRefs.id.current?.value || `HA-2024-${records.length + 1}`,
      date: formRefs.date.current?.value || "",
      batchID: formRefs.batchID.current?.value || "",
      crop: formData.crop || "",
      variety: formRefs.variety.current?.value || "",
      quantity: parseInt(formRefs.quantity.current?.value || "0"),
      location: formData.location || "",
      daysinHolding: 0,
      condition: formData.condition || "",
      dispatchDate: formRefs.dispatchDate.current?.value || "",
      status: (formData.status || "pending") as StatusType,
    };

    if (editingId && editingRecord) {
      dispatch(updateRecord({ ...newRecord, id: editingRecord.id, daysinHolding: editingRecord.daysinHolding }));
      dispatch(setEditingId(null));
      setEditingRecord(null);
    } else {
      dispatch(addRecord(newRecord));
    }

    setIsAddModalOpen(false);
    Object.values(formRefs).forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
    setFormData({ crop: "", location: "", condition: "", status: "" });
  }, [dispatch, editingId, editingRecord, records.length, formData]);

  const handleEdit = useCallback((record: HoldingAreaRecord) => {
    setEditingRecord(record);
    dispatch(setEditingId(record.id));
    setFormData({
      crop: record.crop,
      location: record.location,
      condition: record.condition,
      status: record.status,
    });

    setTimeout(() => {
      if (formRefs.id.current) formRefs.id.current.value = record.id;
      if (formRefs.date.current) formRefs.date.current.value = record.date;
      if (formRefs.batchID.current) formRefs.batchID.current.value = record.batchID;
      if (formRefs.crop.current) formRefs.crop.current.value = record.crop;
      if (formRefs.variety.current) formRefs.variety.current.value = record.variety;
      if (formRefs.quantity.current) formRefs.quantity.current.value = record.quantity.toString();
      if (formRefs.location.current) formRefs.location.current.value = record.location;
      if (formRefs.condition.current) formRefs.condition.current.value = record.condition;
      if (formRefs.dispatchDate.current) formRefs.dispatchDate.current.value = record.dispatchDate;
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
    setFormData({ crop: "", location: "", condition: "", status: "" });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Holding Area</h1>
          <p className="text-[#717182] mt-1">Pre-dispatch storage and quality control</p>
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
                Add to Holding Area
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Record" : "Add Holding Area Record"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input ref={formRefs.date} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input ref={formRefs.batchID} placeholder="SH-2024-XXX" />
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
                  <Label>Variety</Label>
                  <Input ref={formRefs.variety} placeholder="Enter variety" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input ref={formRefs.quantity} type="number" placeholder="1950" />
                </div>
                <div className="space-y-2">
                  <Label>Location Zone</Label>
                  <Select value={formData.location} onValueChange={(v) => { setFormData(prev => ({ ...prev, location: v })); if (formRefs.location.current) formRefs.location.current.value = v; }}>
                    <SelectTrigger ref={formRefs.location as any} className="bg-white">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Zone A-1">Zone A-1</SelectItem>
                      <SelectItem value="Zone A-2">Zone A-2</SelectItem>
                      <SelectItem value="Zone B-1">Zone B-1</SelectItem>
                      <SelectItem value="Zone B-2">Zone B-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plant Condition</Label>
                  <Select value={formData.condition} onValueChange={(v) => { setFormData(prev => ({ ...prev, condition: v })); if (formRefs.condition.current) formRefs.condition.current.value = v; }}>
                    <SelectTrigger ref={formRefs.condition as any} className="bg-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Dispatch Date</Label>
                  <Input ref={formRefs.dispatchDate} type="date" />
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
              placeholder="Search holding area..."
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
          <h3>Holding Area Register</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Quantity</TableHead>
                <TableHead className="font-bold text-[#333333]">Location</TableHead>
                <TableHead className="font-bold text-[#333333]">Condition</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.batchID}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{record.condition}</TableCell>
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
