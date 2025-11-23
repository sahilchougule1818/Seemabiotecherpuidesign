import { useState } from "react";
import { Plus, Filter, Download } from "lucide-react";
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

export function Sampling() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    { title: "Total Samples", value: "124", icon: TestTube },
    { title: "Passed Tests", value: "108", icon: CheckCircle },
    { title: "Pending Analysis", value: "12", icon: Clock },
    { title: "Failed Tests", value: "4", icon: XCircle },
  ];

  const samplingData = [
    {
      id: "SMP-2024-001",
      date: "2024-11-20",
      batchID: "SC-2024-001",
      sampleType: "Culture Media",
      testType: "Contamination",
      result: "Negative",
      testedBy: "Lab Tech A",
      govVerified: "Yes",
      certNumber: "CERT-2024-001",
      remarks: "Clear, no growth",
      status: "completed" as StatusType,
    },
    {
      id: "SMP-2024-002",
      date: "2024-11-21",
      batchID: "SC-2024-002",
      sampleType: "Plant Tissue",
      testType: "Viability",
      result: "95%",
      testedBy: "Lab Tech B",
      remarks: "Excellent viability",
      status: "completed" as StatusType,
    },
    {
      id: "SMP-2024-003",
      date: "2024-11-22",
      batchID: "SC-2024-003",
      sampleType: "Culture Media",
      testType: "pH Level",
      result: "5.8",
      testedBy: "Lab Tech A",
      remarks: "Within range",
      status: "active" as StatusType,
    },
    {
      id: "SMP-2024-004",
      date: "2024-11-22",
      batchID: "SC-2024-004",
      sampleType: "Plant Tissue",
      testType: "Contamination",
      result: "Positive",
      testedBy: "Lab Tech C",
      remarks: "Bacterial growth detected",
      status: "contaminated" as StatusType,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="w-4 h-4" />
                Add Sample Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Sample Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Sample ID</Label>
                  <Input placeholder="SMP-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input placeholder="SC-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Sample Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="media">Culture Media</SelectItem>
                      <SelectItem value="tissue">Plant Tissue</SelectItem>
                      <SelectItem value="water">Water Sample</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Test Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contamination">Contamination</SelectItem>
                      <SelectItem value="viability">Viability</SelectItem>
                      <SelectItem value="ph">pH Level</SelectItem>
                      <SelectItem value="nutrient">Nutrient Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Result</Label>
                  <Input placeholder="Enter result" />
                </div>
                <div className="space-y-2">
                  <Label>Tested By</Label>
                  <Input placeholder="Technician name" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Remarks</Label>
                  <Textarea placeholder="Enter remarks" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Verified by Government</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Certificate Number</Label>
                  <Input placeholder="Enter certificate number" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Reason (if not verified)</Label>
                  <Input placeholder="Enter reason for non-verification" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={() => setIsAddModalOpen(false)}>
                  Save Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Test Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Contamination Tests</h4>
          <p className="text-[#555555]">45 samples</p>
          <p className="text-sm text-[#4CAF50] mt-1">93% pass rate</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Viability Tests</h4>
          <p className="text-[#555555]">38 samples</p>
          <p className="text-sm text-[#4CAF50] mt-1">Avg: 92% viable</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">pH Analysis</h4>
          <p className="text-[#555555]">28 samples</p>
          <p className="text-sm text-[#4CAF50] mt-1">Avg: 5.7</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Nutrient Analysis</h4>
          <p className="text-[#555555]">13 samples</p>
          <p className="text-sm text-[#4CAF50] mt-1">98% optimal</p>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3>Sampling Register</h3>
          <Input placeholder="Search samples..." className="max-w-xs" />
        </div>
        <div className="border rounded-lg overflow-hidden">
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
              {samplingData.map((row) => (
                <TableRow key={row.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.batchID}</TableCell>
                  <TableCell>{row.sampleType}</TableCell>
                  <TableCell>{row.testType}</TableCell>
                  <TableCell>{row.result}</TableCell>
                  <TableCell>{row.testedBy}</TableCell>
                  <TableCell>{row.govVerified || "N/A"}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
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
