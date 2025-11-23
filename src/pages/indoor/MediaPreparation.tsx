import { useState } from "react";
import { Plus, Filter, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { StatusBadge, StatusType } from "../../components/common/StatusBadge";
import { StatsCard } from "../../components/common/StatsCard";
import { FlaskConical, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export function MediaPreparation() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    { title: "Total Batches", value: "48", icon: FlaskConical, trend: { value: "+12% this month", isPositive: true } },
    { title: "Active Batches", value: "15", icon: CheckCircle },
    { title: "Pending Autoclave", value: "8", icon: Clock },
    { title: "Contaminated", value: "2", icon: AlertTriangle, trend: { value: "-5% vs last month", isPositive: true } },
  ];

  const autoclaveData = [
    { id: "AC-001", date: "2024-11-20", batch: "MB-2024-001", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "completed" as StatusType },
    { id: "AC-002", date: "2024-11-21", batch: "MB-2024-002", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "active" as StatusType },
    { id: "AC-003", date: "2024-11-22", batch: "MB-2024-003", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "pending" as StatusType },
    { id: "AC-004", date: "2024-11-22", batch: "MB-2024-004", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "contaminated" as StatusType },
  ];

  const mediaBatchData = [
    { id: "MB-2024-001", prepDate: "2024-11-18", mediaType: "MS Medium", quantity: "5L", pH: "5.8", preparedBy: "Rajesh Kumar", status: "completed" as StatusType },
    { id: "MB-2024-002", prepDate: "2024-11-19", mediaType: "WPM Medium", quantity: "3L", pH: "5.7", preparedBy: "Priya Sharma", status: "active" as StatusType },
    { id: "MB-2024-003", prepDate: "2024-11-20", mediaType: "MS Medium", quantity: "4L", pH: "5.8", preparedBy: "Amit Patel", status: "pending" as StatusType },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Media Preparation</h1>
          <p className="text-[#717182] mt-1">Manage media batches and autoclave processes</p>
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
                Add Media Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Media Batch</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input placeholder="MB-2024-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Preparation Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ms">MS Medium</SelectItem>
                      <SelectItem value="wpm">WPM Medium</SelectItem>
                      <SelectItem value="b5">B5 Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity (L)</Label>
                  <Input type="number" placeholder="5.0" />
                </div>
                <div className="space-y-2">
                  <Label>pH Level</Label>
                  <Input type="number" placeholder="5.8" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Prepared By</Label>
                  <Input placeholder="Employee name" />
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
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={() => setIsAddModalOpen(false)}>
                  Save Batch
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

      {/* Tabs for Different Registers */}
      <Card className="p-6 bg-white border-border/50">
        <Tabs defaultValue="autoclave" className="space-y-4">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="autoclave" 
              className="data-[state=active]:bg-[#333333] data-[state=active]:text-white data-[state=inactive]:bg-[#F5F5F5] data-[state=inactive]:text-[#555555] px-6 py-2 rounded-md font-medium"
            >
              Autoclave Register
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="data-[state=active]:bg-[#333333] data-[state=active]:text-white data-[state=inactive]:bg-[#F5F5F5] data-[state=inactive]:text-[#555555] px-6 py-2 rounded-md font-medium"
            >
              Media Batch Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="autoclave" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Autoclave Register</h3>
              <Input placeholder="Search autoclave records..." className="max-w-xs" />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F5]">
                    <TableHead className="font-bold text-[#333333]">Autoclave ID</TableHead>
                    <TableHead className="font-bold text-[#333333]">Date</TableHead>
                    <TableHead className="font-bold text-[#333333]">Batch No.</TableHead>
                    <TableHead className="font-bold text-[#333333]">Temperature</TableHead>
                    <TableHead className="font-bold text-[#333333]">Pressure</TableHead>
                    <TableHead className="font-bold text-[#333333]">Duration</TableHead>
                    <TableHead className="font-bold text-[#333333]">Status</TableHead>
                    <TableHead className="font-bold text-[#333333]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autoclaveData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-[#F3FFF4] transition-colors">
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.batch}</TableCell>
                      <TableCell>{row.temperature}</TableCell>
                      <TableCell>{row.pressure}</TableCell>
                      <TableCell>{row.duration}</TableCell>
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
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Media Batch Register</h3>
              <Input placeholder="Search media batches..." className="max-w-xs" />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F5]">
                    <TableHead className="font-bold text-[#333333]">Batch ID</TableHead>
                    <TableHead className="font-bold text-[#333333]">Prep Date</TableHead>
                    <TableHead className="font-bold text-[#333333]">Media Type</TableHead>
                    <TableHead className="font-bold text-[#333333]">Quantity</TableHead>
                    <TableHead className="font-bold text-[#333333]">pH</TableHead>
                    <TableHead className="font-bold text-[#333333]">Prepared By</TableHead>
                    <TableHead className="font-bold text-[#333333]">Status</TableHead>
                    <TableHead className="font-bold text-[#333333]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaBatchData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-[#F3FFF4] transition-colors">
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.prepDate}</TableCell>
                      <TableCell>{row.mediaType}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.pH}</TableCell>
                      <TableCell>{row.preparedBy}</TableCell>
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
          </TabsContent>
        </Tabs>
      </Card>

      {/* 8-Stage Tissue Culture Workflow */}
      <Card className="p-6 bg-white border-border/50">
        <h3 className="mb-4">8-Stage Tissue Culture Workflow</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">Stage</TableHead>
                <TableHead className="font-bold text-[#333333]">Process</TableHead>
                <TableHead className="font-bold text-[#333333]">Duration</TableHead>
                <TableHead className="font-bold text-[#333333]">Operator</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 1</TableCell>
                <TableCell>Mother Plant Selection</TableCell>
                <TableCell>2 days</TableCell>
                <TableCell>Rajesh Kumar</TableCell>
                <TableCell><StatusBadge status="completed" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 2</TableCell>
                <TableCell>Explant Preparation</TableCell>
                <TableCell>1 day</TableCell>
                <TableCell>Priya Sharma</TableCell>
                <TableCell><StatusBadge status="completed" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 3</TableCell>
                <TableCell>Surface Sterilization</TableCell>
                <TableCell>3 hours</TableCell>
                <TableCell>Amit Patel</TableCell>
                <TableCell><StatusBadge status="completed" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 4</TableCell>
                <TableCell>Inoculation</TableCell>
                <TableCell>1 day</TableCell>
                <TableCell>Sunita Verma</TableCell>
                <TableCell><StatusBadge status="active" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 5</TableCell>
                <TableCell>Multiplication</TableCell>
                <TableCell>21 days</TableCell>
                <TableCell>Vikram Singh</TableCell>
                <TableCell><StatusBadge status="pending" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 6</TableCell>
                <TableCell>Rooting</TableCell>
                <TableCell>14 days</TableCell>
                <TableCell>Anjali Reddy</TableCell>
                <TableCell><StatusBadge status="pending" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 7</TableCell>
                <TableCell>Acclimatization</TableCell>
                <TableCell>10 days</TableCell>
                <TableCell>Deepak Gupta</TableCell>
                <TableCell><StatusBadge status="pending" /></TableCell>
              </TableRow>
              <TableRow className="hover:bg-[#F3FFF4] transition-colors">
                <TableCell className="font-medium">Stage 8</TableCell>
                <TableCell>Hardening & Transfer</TableCell>
                <TableCell>7 days</TableCell>
                <TableCell>Meena Iyer</TableCell>
                <TableCell><StatusBadge status="pending" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
