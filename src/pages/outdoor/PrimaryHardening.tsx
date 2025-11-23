import { useState } from "react";
import { Plus, Filter, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { StatusBadge, StatusType } from "../../components/common/StatusBadge";
import { StatsCard } from "../../components/common/StatsCard";
import { Sprout, CheckCircle, Clock, MapPin } from "lucide-react";

export function PrimaryHardening() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    { title: "Active Batches", value: "32", icon: Sprout, trend: { value: "+6 this week", isPositive: true } },
    { title: "Total Plants", value: "8,540", icon: CheckCircle },
    { title: "Awaiting Transfer", value: "15", icon: Clock },
    { title: "Available Beds", value: "18/45", icon: MapPin },
  ];

  const hardeningData = [
    {
      id: "PH-2024-001",
      date: "2024-11-15",
      batchName: "Banana-GN-Nov",
      crop: "Banana",
      tunnel: "T1",
      bed: "B1",
      row: "R1-R5",
      cavity: "50",
      plants: 2500,
      workers: 4,
      waitingPeriod: "14 days",
      status: "active" as StatusType,
    },
    {
      id: "PH-2024-002",
      date: "2024-11-16",
      batchName: "Bamboo-DC-Nov",
      crop: "Bamboo",
      tunnel: "T2",
      bed: "B2",
      row: "R1-R3",
      cavity: "72",
      plants: 1800,
      workers: 3,
      waitingPeriod: "21 days",
      status: "active" as StatusType,
    },
    {
      id: "PH-2024-003",
      date: "2024-11-18",
      batchName: "Teak-TG-Nov",
      crop: "Teak",
      tunnel: "T1",
      bed: "B3",
      row: "R1-R4",
      cavity: "50",
      plants: 2000,
      workers: 3,
      waitingPeriod: "28 days",
      status: "pending" as StatusType,
    },
    {
      id: "PH-2024-004",
      date: "2024-11-10",
      batchName: "Ornamental-A-Nov",
      crop: "Ornamental",
      tunnel: "T3",
      bed: "B1",
      row: "R1-R6",
      cavity: "40",
      plants: 3000,
      workers: 5,
      waitingPeriod: "14 days",
      status: "completed" as StatusType,
    },
  ];

  // Mock tunnel/bed grid data
  const tunnels = ["T1", "T2", "T3"];
  const beds = ["B1", "B2", "B3", "B4", "B5"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Primary Hardening</h1>
          <p className="text-[#717182] mt-1">Manage plant acclimatization in controlled tunnels</p>
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
                Add Primary Hardening
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Primary Hardening Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Batch Name</Label>
                  <Input placeholder="e.g., Banana-GN-Nov" />
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
                  <Label>Tunnel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tunnel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t1">T1</SelectItem>
                      <SelectItem value="t2">T2</SelectItem>
                      <SelectItem value="t3">T3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bed</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b1">B1</SelectItem>
                      <SelectItem value="b2">B2</SelectItem>
                      <SelectItem value="b3">B3</SelectItem>
                      <SelectItem value="b4">B4</SelectItem>
                      <SelectItem value="b5">B5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Row</Label>
                  <Input placeholder="e.g., R1-R5" />
                </div>
                <div className="space-y-2">
                  <Label>Cavity Size</Label>
                  <Input type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Plants</Label>
                  <Input type="number" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Workers</Label>
                  <Input type="number" placeholder="4" />
                </div>
                <div className="space-y-2">
                  <Label>Waiting Period</Label>
                  <Input placeholder="e.g., 14 days" />
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

      {/* Table View */}
      {(
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3>Primary Hardening Register</h3>
            <Input placeholder="Search batches..." className="max-w-xs" />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5F5F5]">
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Tunnel</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Row</TableHead>
                  <TableHead>Cavity</TableHead>
                  <TableHead>Plants</TableHead>
                  <TableHead>Workers</TableHead>
                  <TableHead>Waiting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hardeningData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-[#F3FFF4] transition-colors">
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.batchName}</TableCell>
                    <TableCell>{row.crop}</TableCell>
                    <TableCell>{row.tunnel}</TableCell>
                    <TableCell>{row.bed}</TableCell>
                    <TableCell>{row.row}</TableCell>
                    <TableCell>{row.cavity}</TableCell>
                    <TableCell>{row.plants}</TableCell>
                    <TableCell>{row.workers}</TableCell>
                    <TableCell>{row.waitingPeriod}</TableCell>
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
      )}

      {/* Crop Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Banana</h4>
          <p className="text-[#555555]">4,500 plants</p>
          <p className="text-sm text-[#717182] mt-1">8 active batches</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Bamboo</h4>
          <p className="text-[#555555]">2,200 plants</p>
          <p className="text-sm text-[#717182] mt-1">5 active batches</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Teak</h4>
          <p className="text-[#555555]">1,840 plants</p>
          <p className="text-sm text-[#717182] mt-1">4 active batches</p>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h4 className="mb-2">Ornamental</h4>
          <p className="text-[#555555]">3,000 plants</p>
          <p className="text-sm text-[#717182] mt-1">6 active batches</p>
        </Card>
      </div>
    </div>
  );
}
