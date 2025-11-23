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
  setSearchTerm,
  type IndoorSamplingRecord,
} from "../../store/slices/indoorSamplingSlice";

export function Sampling() {
  const dispatch = useAppDispatch();
  const { records, searchTerm } = useAppSelector((state) => state.indoorSampling);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<StatusType | "all">("all");
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const [form, setForm] = useState({
    id: "",
    date: "",
    batchID: "",
    sampleType: "",
    testType: "",
    result: "",
    testedBy: "",
    remarks: "",
    govVerified: "",
    certNumber: "",
    status: "pending" as StatusType,
  });

  const [editingRecord, setEditingRecord] = useState<IndoorSamplingRecord | null>(null);

  const stats = [
    { title: "Total Samples", value: records.length.toString(), icon: TestTube },
    { title: "Passed Tests", value: records.filter((r) => r.status === "completed").length.toString(), icon: CheckCircle },
    { title: "Pending Analysis", value: records.filter((r) => r.status === "pending" || r.status === "active").length.toString(), icon: Clock },
    { title: "Failed Tests", value: records.filter((r) => r.status === "contaminated").length.toString(), icon: XCircle },
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

  const handleAdd = () => {
    if (!form.id || !form.date || !form.batchID || !form.sampleType || !form.testType || !form.testedBy || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    const newRecord: IndoorSamplingRecord = {
      id: form.id,
      date: form.date,
      batchID: form.batchID,
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
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = useCallback((record: IndoorSamplingRecord) => {
    setEditingRecord(record);
    setForm({
      id: record.id,
      date: record.date,
      batchID: record.batchID,
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
    if (!form.id || !form.date || !form.batchID || !form.sampleType || !form.testType || !form.testedBy || !form.status) {
      alert("Please fill in all required fields");
      return;
    }
    if (editingRecord) {
      const updatedRecord: IndoorSamplingRecord = {
        id: form.id,
        date: form.date,
        batchID: form.batchID,
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
      sampleType: "",
      testType: "",
      result: "",
      testedBy: "",
      remarks: "",
      govVerified: "",
      certNumber: "",
      status: "pending",
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
          <h1>Sampling</h1>
          <p className="text-[#717182] mt-1">Quality control and testing of cultures and media</p>
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
                placeholder="Search samples..."
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
                  Add Sample Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Sample Record</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Sample ID</Label>
                    <Input placeholder="SMP-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch ID</Label>
                    <Input placeholder="SC-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sample Type</Label>
                    <Select value={form.sampleType} onValueChange={(v) => setForm({...form, sampleType: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Culture Media">Culture Media</SelectItem>
                        <SelectItem value="Plant Tissue">Plant Tissue</SelectItem>
                        <SelectItem value="Water Sample">Water Sample</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Test Type</Label>
                    <Select value={form.testType} onValueChange={(v) => setForm({...form, testType: v})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select test" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Contamination">Contamination</SelectItem>
                        <SelectItem value="Viability">Viability</SelectItem>
                        <SelectItem value="pH Level">pH Level</SelectItem>
                        <SelectItem value="Nutrient Analysis">Nutrient Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <Input placeholder="Enter result" value={form.result} onChange={(e) => setForm({...form, result: e.target.value})} />
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate Number</Label>
                    <Input placeholder="CERT-XXX" value={form.certNumber} onChange={(e) => setForm({...form, certNumber: e.target.value})} />
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
                  <div className="space-y-2 col-span-2">
                    <Label>Remarks</Label>
                    <Textarea placeholder="Enter remarks" rows={3} value={form.remarks} onChange={(e) => setForm({...form, remarks: e.target.value})} />
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
                <TableHead className="font-bold text-[#333333]">Sample ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Date</TableHead>
                <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                <TableHead className="font-bold text-[#333333]">Sample Type</TableHead>
                <TableHead className="font-bold text-[#333333]">Test Type</TableHead>
                <TableHead className="font-bold text-[#333333]">Result</TableHead>
                <TableHead className="font-bold text-[#333333]">Tested By</TableHead>
                <TableHead className="font-bold text-[#333333]">Gov. Verified</TableHead>
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
                  <TableCell>{record.sampleType}</TableCell>
                  <TableCell>{record.testType}</TableCell>
                  <TableCell>{record.result}</TableCell>
                  <TableCell>{record.testedBy}</TableCell>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sample Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Sample ID</Label>
              <Input placeholder="SMP-2024-XXX" value={form.id} onChange={(e) => setForm({...form, id: e.target.value})} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input placeholder="SC-2024-XXX" value={form.batchID} onChange={(e) => setForm({...form, batchID: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Sample Type</Label>
              <Select value={form.sampleType} onValueChange={(v) => setForm({...form, sampleType: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Culture Media">Culture Media</SelectItem>
                  <SelectItem value="Plant Tissue">Plant Tissue</SelectItem>
                  <SelectItem value="Water Sample">Water Sample</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select value={form.testType} onValueChange={(v) => setForm({...form, testType: v})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Contamination">Contamination</SelectItem>
                  <SelectItem value="Viability">Viability</SelectItem>
                  <SelectItem value="pH Level">pH Level</SelectItem>
                  <SelectItem value="Nutrient Analysis">Nutrient Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Input placeholder="Enter result" value={form.result} onChange={(e) => setForm({...form, result: e.target.value})} />
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input placeholder="CERT-XXX" value={form.certNumber} onChange={(e) => setForm({...form, certNumber: e.target.value})} />
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
            <div className="space-y-2 col-span-2">
              <Label>Remarks</Label>
              <Textarea placeholder="Enter remarks" rows={3} value={form.remarks} onChange={(e) => setForm({...form, remarks: e.target.value})} />
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
