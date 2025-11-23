import { useState, useMemo, useCallback, useRef } from "react";
import { Plus, Filter, Download, Trash2, Edit2 } from "lucide-react";
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
import { TestTube, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
  type OutdoorSamplingRecord,
} from "../../store/slices/outdoorSamplingSlice";

export function OutdoorSampling() {
  const dispatch = useAppDispatch();
  const { records, searchTerm, filterStatus, editingId } = useAppSelector((state) => state.outdoorSampling);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [editingRecord, setEditingRecord] = useState<OutdoorSamplingRecord | null>(null);
  const [formData, setFormData] = useState({
    stage: "",
    crop: "",
    sampleType: "",
    testType: "",
    govVerified: "",
    status: "",
  });

  const formRefs = {
    id: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    batchID: useRef<HTMLInputElement>(null),
    stage: useRef<HTMLSelectElement>(null),
    crop: useRef<HTMLSelectElement>(null),
    sampleType: useRef<HTMLSelectElement>(null),
    testType: useRef<HTMLSelectElement>(null),
    result: useRef<HTMLInputElement>(null),
    testedBy: useRef<HTMLInputElement>(null),
    remarks: useRef<HTMLTextAreaElement>(null),
    govVerified: useRef<HTMLSelectElement>(null),
    certNumber: useRef<HTMLInputElement>(null),
    status: useRef<HTMLSelectElement>(null),
  };

  const stats = [
    { title: "Total Samples", value: records.length.toString(), icon: TestTube },
    { title: "Passed Tests", value: records.filter((r) => r.status === "completed").length.toString(), icon: CheckCircle },
    { title: "Pending Analysis", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Failed Tests", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: XCircle },
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
    const newRecord: OutdoorSamplingRecord = {
      id: formRefs.id.current?.value || `OS-2024-${String(records.length + 1).padStart(3, '0')}`,
      date: formRefs.date.current?.value || new Date().toISOString().split('T')[0],
      batchID: formRefs.batchID.current?.value || "",
      stage: formData.stage || "Hardening",
      crop: formData.crop || "Banana",
      sampleType: formData.sampleType || "Visual",
      testType: formData.testType || "Quality Check",
      result: formRefs.result.current?.value || "",
      testedBy: formRefs.testedBy.current?.value || "",
      remarks: formRefs.remarks.current?.value || "",
      govVerified: formData.govVerified || "No",
      certNumber: formRefs.certNumber.current?.value || "",
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
    setFormData({ stage: "", crop: "", sampleType: "", testType: "", govVerified: "", status: "" });
  }, [dispatch, editingId, editingRecord, records.length, formData]);

  const handleEdit = useCallback((record: OutdoorSamplingRecord) => {
    setEditingRecord(record);
    dispatch(setEditingId(record.id));
    setFormData({
      stage: record.stage,
      crop: record.crop,
      sampleType: record.sampleType,
      testType: record.testType,
      govVerified: record.govVerified || "No",
      status: record.status,
    });

    setTimeout(() => {
      if (formRefs.id.current) formRefs.id.current.value = record.id;
      if (formRefs.date.current) formRefs.date.current.value = record.date;
      if (formRefs.batchID.current) formRefs.batchID.current.value = record.batchID;
      if (formRefs.stage.current) formRefs.stage.current.value = record.stage;
      if (formRefs.crop.current) formRefs.crop.current.value = record.crop;
      if (formRefs.sampleType.current) formRefs.sampleType.current.value = record.sampleType;
      if (formRefs.testType.current) formRefs.testType.current.value = record.testType;
      if (formRefs.result.current) formRefs.result.current.value = record.result;
      if (formRefs.testedBy.current) formRefs.testedBy.current.value = record.testedBy;
      if (formRefs.remarks.current) formRefs.remarks.current.value = record.remarks;
      if (formRefs.govVerified.current) formRefs.govVerified.current.value = record.govVerified || "No";
      if (formRefs.certNumber.current) formRefs.certNumber.current.value = record.certNumber || "";
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
    setFormData({ stage: "", crop: "", sampleType: "", testType: "", govVerified: "", status: "" });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Outdoor Sampling</h1>
          <p className="text-[#717182] mt-1">Field-level quality control and testing</p>
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
                Add Sample Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Sample Record" : "Add Outdoor Sample Record"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label>Sample ID</Label>
                  <Input ref={formRefs.id} placeholder="OS-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input ref={formRefs.date} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input ref={formRefs.batchID} placeholder="PH-2024-XXX or SH-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={formData.stage} onValueChange={(v) => { setFormData(prev => ({ ...prev, stage: v })); if (formRefs.stage.current) formRefs.stage.current.value = v; }}>
                    <SelectTrigger ref={formRefs.stage as any} className="bg-white">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Primary">Primary Hardening</SelectItem>
                      <SelectItem value="Secondary">Secondary Hardening</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>Sample Type</Label>
                  <Select value={formData.sampleType} onValueChange={(v) => { setFormData(prev => ({ ...prev, sampleType: v })); if (formRefs.sampleType.current) formRefs.sampleType.current.value = v; }}>
                    <SelectTrigger ref={formRefs.sampleType as any} className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Plant Health">Plant Health</SelectItem>
                      <SelectItem value="Soil Quality">Soil Quality</SelectItem>
                      <SelectItem value="Water Quality">Water Quality</SelectItem>
                      <SelectItem value="Pest & Disease">Pest & Disease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Test Type</Label>
                  <Select value={formData.testType} onValueChange={(v) => { setFormData(prev => ({ ...prev, testType: v })); if (formRefs.testType.current) formRefs.testType.current.value = v; }}>
                    <SelectTrigger ref={formRefs.testType as any} className="bg-white">
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Visual Inspection">Visual Inspection</SelectItem>
                      <SelectItem value="Leaf Analysis">Leaf Analysis</SelectItem>
                      <SelectItem value="pH & Nutrients">pH & Nutrients</SelectItem>
                      <SelectItem value="Contamination">Contamination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <Input ref={formRefs.result} placeholder="Test result" />
                </div>
                <div className="space-y-2">
                  <Label>Tested By</Label>
                  <Input ref={formRefs.testedBy} placeholder="Technician name" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Remarks</Label>
                  <Textarea ref={formRefs.remarks} placeholder="Enter remarks" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Verified by Government</Label>
                  <Select value={formData.govVerified} onValueChange={(v) => { setFormData(prev => ({ ...prev, govVerified: v })); if (formRefs.govVerified.current) formRefs.govVerified.current.value = v; }}>
                    <SelectTrigger ref={formRefs.govVerified as any} className="bg-white">
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Certificate Number</Label>
                  <Input ref={formRefs.certNumber} placeholder="Enter certificate number" />
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
              placeholder="Search outdoor samples..."
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
          <h3>Outdoor Sampling Register</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Crop</TableHead>
                <TableHead className="font-bold text-[#333333]">Test Type</TableHead>
                <TableHead className="font-bold text-[#333333]">Result</TableHead>
                <TableHead className="font-bold text-[#333333]">Gov. Verified</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.crop}</TableCell>
                  <TableCell>{record.testType}</TableCell>
                  <TableCell>{record.result}</TableCell>
                  <TableCell>{record.govVerified || "N/A"}</TableCell>
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
