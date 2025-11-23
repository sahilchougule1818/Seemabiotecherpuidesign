import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Download, Trash2, Edit2, Search } from "lucide-react";
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
  type OutdoorSamplingRecord,
} from "../../store/slices/outdoorSamplingSlice";

export function OutdoorSampling() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.outdoorSampling);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    batchID: "",
    stage: "",
    crop: "",
    sampleType: "",
    testType: "",
    result: "",
    testedBy: "",
    remarks: "",
    govVerified: "",
    certNumber: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<OutdoorSamplingRecord | null>(null);

  const stats = [
    { title: "Total Tests", value: records.length.toString(), icon: TestTube, trend: { value: "+18 this week", isPositive: true } },
    { title: "Passed Tests", value: records.filter((r) => r.result === "Pass").length.toString(), icon: CheckCircle },
    { title: "Pending Tests", value: records.filter((r) => r.status === "pending").length.toString(), icon: Clock },
    { title: "Failed Tests", value: records.filter((r) => r.result === "Fail").length.toString(), icon: XCircle },
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
    const newRecord: OutdoorSamplingRecord = {
      id: form.id,
      date: form.date,
      batchID: form.batchID,
      stage: form.stage,
      crop: form.crop,
      sampleType: form.sampleType,
      testType: form.testType,
      result: form.result,
      testedBy: form.testedBy,
      remarks: form.remarks,
      govVerified: form.govVerified,
      certNumber: form.certNumber,
      status: form.status,
    };
    dispatch(addRecord(newRecord));
    setForm({
      id: "",
      date: "",
      batchID: "",
      stage: "",
      crop: "",
      sampleType: "",
      testType: "",
      result: "",
      testedBy: "",
      remarks: "",
      govVerified: "",
      certNumber: "",
      status: "pending",
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: OutdoorSamplingRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      batchID: record.batchID,
      stage: record.stage,
      crop: record.crop,
      sampleType: record.sampleType,
      testType: record.testType,
      result: record.result,
      testedBy: record.testedBy,
      remarks: record.remarks,
      govVerified: record.govVerified || "",
      certNumber: record.certNumber || "",
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord: OutdoorSamplingRecord = {
        id: form.id,
        date: form.date,
        batchID: form.batchID,
        stage: form.stage,
        crop: form.crop,
        sampleType: form.sampleType,
        testType: form.testType,
        result: form.result,
        testedBy: form.testedBy,
        remarks: form.remarks,
        govVerified: form.govVerified,
        certNumber: form.certNumber,
        status: form.status,
      };
      dispatch(updateRecord(updatedRecord));
      setForm({
        id: "",
        date: "",
        batchID: "",
        stage: "",
        crop: "",
        sampleType: "",
        testType: "",
        result: "",
        testedBy: "",
        remarks: "",
        govVerified: "",
        certNumber: "",
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
        stage: "",
        crop: "",
        sampleType: "",
        testType: "",
        result: "",
        testedBy: "",
        remarks: "",
        govVerified: "",
        certNumber: "",
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
      stage: "",
      crop: "",
      sampleType: "",
      testType: "",
      result: "",
      testedBy: "",
      remarks: "",
      govVerified: "",
      certNumber: "",
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
          <h1>Outdoor Sampling</h1>
          <p className="text-[#717182] mt-1">Track quality control sampling and testing</p>
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
                Add Sampling Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Outdoor Sampling Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Sample ID</Label>
                  <Input placeholder="OS-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
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
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Primary Hardening">Primary Hardening</SelectItem>
                      <SelectItem value="Secondary Hardening">Secondary Hardening</SelectItem>
                      <SelectItem value="Holding Area">Holding Area</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>Sample Type</Label>
                  <Select value={form.sampleType} onValueChange={(v) => setForm({...form, sampleType: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Leaf">Leaf</SelectItem>
                      <SelectItem value="Root">Root</SelectItem>
                      <SelectItem value="Stem">Stem</SelectItem>
                      <SelectItem value="Soil">Soil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Test Type</Label>
                  <Select value={form.testType} onValueChange={(v) => setForm({...form, testType: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Contamination">Contamination</SelectItem>
                      <SelectItem value="Disease">Disease</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                      <SelectItem value="Genetics">Genetics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <Select value={form.result} onValueChange={(v) => setForm({...form, result: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Fail">Fail</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tested By</Label>
                  <Input placeholder="Technician name" value={form.testedBy} onChange={(e) => setForm({...form, testedBy: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Government Verified</Label>
                  <Select value={form.govVerified} onValueChange={(v) => setForm({...form, govVerified: v})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select verification" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Certificate Number</Label>
                  <Input placeholder="Enter certificate number" value={form.certNumber} onChange={(e) => setForm({...form, certNumber: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Remarks</Label>
                  <Textarea placeholder="Enter remarks" value={form.remarks} onChange={(e) => setForm({...form, remarks: e.target.value})} />
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
                <TableHead className="font-bold text-[#333333]">Stage</TableHead>
                <TableHead className="font-bold text-[#333333]">Test Type</TableHead>
                <TableHead className="font-bold text-[#333333]">Result</TableHead>
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
                  <TableCell>{record.stage}</TableCell>
                  <TableCell>{record.testType}</TableCell>
                  <TableCell>{record.result}</TableCell>
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
            <DialogTitle>Edit Outdoor Sampling Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Sample ID</Label>
              <Input placeholder="OS-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
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
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({...form, stage: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Primary Hardening">Primary Hardening</SelectItem>
                  <SelectItem value="Secondary Hardening">Secondary Hardening</SelectItem>
                  <SelectItem value="Holding Area">Holding Area</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Sample Type</Label>
              <Select value={form.sampleType} onValueChange={(v) => setForm({...form, sampleType: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select sample type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Leaf">Leaf</SelectItem>
                  <SelectItem value="Root">Root</SelectItem>
                  <SelectItem value="Stem">Stem</SelectItem>
                  <SelectItem value="Soil">Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select value={form.testType} onValueChange={(v) => setForm({...form, testType: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Contamination">Contamination</SelectItem>
                  <SelectItem value="Disease">Disease</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Genetics">Genetics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Select value={form.result} onValueChange={(v) => setForm({...form, result: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tested By</Label>
              <Input placeholder="Technician name" value={form.testedBy} onChange={(e) => setForm({...form, testedBy: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Government Verified</Label>
              <Select value={form.govVerified} onValueChange={(v) => setForm({...form, govVerified: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select verification" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input placeholder="Enter certificate number" value={form.certNumber} onChange={(e) => setForm({...form, certNumber: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Remarks</Label>
              <Textarea placeholder="Enter remarks" value={form.remarks} onChange={(e) => setForm({...form, remarks: e.target.value})} />
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
