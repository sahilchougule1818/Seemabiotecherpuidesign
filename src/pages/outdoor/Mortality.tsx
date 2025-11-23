import { useState } from "react";
import { Plus, Filter, Download, TrendingDown } from "lucide-react";
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
import { Droplets, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function Mortality() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    { title: "Total Mortality", value: "428", icon: Droplets },
    { title: "Mortality Rate", value: "3.2%", icon: TrendingDown, trend: { value: "-0.5% vs last month", isPositive: true } },
    { title: "Critical Batches", value: "2", icon: AlertTriangle },
    { title: "Within Limit", value: "28", icon: CheckCircle },
  ];

  const mortalityData = [
    {
      id: "MR-2024-001",
      date: "2024-11-20",
      batchID: "PH-2024-001",
      crop: "Banana",
      stage: "Primary",
      initialCount: 2500,
      mortality: 80,
      mortalityRate: "3.2%",
      cause: "Transplant shock",
      action: "Adjusted watering",
      status: "active" as StatusType,
    },
    {
      id: "MR-2024-002",
      date: "2024-11-21",
      batchID: "SH-2024-001",
      crop: "Bamboo",
      stage: "Secondary",
      initialCount: 1800,
      mortality: 54,
      mortalityRate: "3.0%",
      cause: "Fungal infection",
      action: "Fungicide applied",
      status: "completed" as StatusType,
    },
    {
      id: "MR-2024-003",
      date: "2024-11-22",
      batchID: "PH-2024-003",
      crop: "Teak",
      stage: "Primary",
      initialCount: 2000,
      mortality: 120,
      mortalityRate: "6.0%",
      cause: "Environmental stress",
      action: "Monitoring closely",
      status: "contaminated" as StatusType,
    },
    {
      id: "MR-2024-004",
      date: "2024-11-19",
      batchID: "SH-2024-002",
      crop: "Ornamental",
      stage: "Secondary",
      initialCount: 3000,
      mortality: 90,
      mortalityRate: "3.0%",
      cause: "Normal attrition",
      action: "No action needed",
      status: "completed" as StatusType,
    },
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Mortality Tracking</h1>
          <p className="text-[#717182] mt-1">Monitor and analyze plant loss across batches</p>
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
                Add Mortality Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Mortality Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input placeholder="PH-2024-XXX or SH-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="bamboo">Bamboo</SelectItem>
                      <SelectItem value="teak">Teak</SelectItem>
                      <SelectItem value="ornamental">Ornamental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Hardening</SelectItem>
                      <SelectItem value="secondary">Secondary Hardening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Plant Count</Label>
                  <Input type="number" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label>Mortality Count</Label>
                  <Input type="number" placeholder="80" />
                </div>
                <div className="space-y-2">
                  <Label>Cause of Mortality</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cause" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transplant">Transplant shock</SelectItem>
                      <SelectItem value="fungal">Fungal infection</SelectItem>
                      <SelectItem value="bacterial">Bacterial infection</SelectItem>
                      <SelectItem value="environmental">Environmental stress</SelectItem>
                      <SelectItem value="normal">Normal attrition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active Monitoring</SelectItem>
                      <SelectItem value="completed">Resolved</SelectItem>
                      <SelectItem value="contaminated">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Action Taken</Label>
                  <Textarea placeholder="Describe corrective actions..." rows={3} />
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

      {/* Crop-wise Mortality */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Banana</h4>
          <p className="text-[#555555]">2.8%</p>
          <p className="text-sm text-[#4CAF50] mt-1">Below average</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Bamboo</h4>
          <p className="text-[#555555]">3.0%</p>
          <p className="text-sm text-[#4CAF50] mt-1">Normal range</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Teak</h4>
          <p className="text-[#555555]">4.5%</p>
          <p className="text-sm text-[#FFC107] mt-1">Above average</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Ornamental</h4>
          <p className="text-[#555555]">3.2%</p>
          <p className="text-sm text-[#4CAF50] mt-1">Normal range</p>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3>Mortality Register</h3>
          <Input placeholder="Search mortality records..." className="max-w-xs" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead>Record ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Initial Count</TableHead>
                <TableHead>Mortality</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mortalityData.map((row) => (
                <TableRow key={row.id} className="hover:bg-[#F3FFF4] transition-colors">
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.batchID}</TableCell>
                  <TableCell>{row.crop}</TableCell>
                  <TableCell>{row.stage}</TableCell>
                  <TableCell>{row.initialCount}</TableCell>
                  <TableCell>{row.mortality}</TableCell>
                  <TableCell>
                    <span className={parseFloat(row.mortalityRate) > 5 ? "text-[#d4183d]" : "text-[#4CAF50]"}>
                      {row.mortalityRate}
                    </span>
                  </TableCell>
                  <TableCell>{row.cause}</TableCell>
                  <TableCell>{row.action}</TableCell>
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
