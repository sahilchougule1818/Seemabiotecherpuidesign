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
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { addAutoclaveRecord, addMediaBatchRecord } from "../../store/slices/mediaPreparationSlice";

export function MediaPreparation() {
  const dispatch = useAppDispatch();
  const { autoclaveRecords, mediaBatchRecords } = useAppSelector((state) => state.mediaPreparation);
  
  const [isAddAutoclaveModalOpen, setIsAddAutoclaveModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  
  const [autoclaveForm, setAutoclaveForm] = useState({
    id: "",
    date: "",
    batch: "",
    temperature: "",
    pressure: "",
    duration: "",
    status: "pending" as StatusType
  });
  
  const [mediaForm, setMediaForm] = useState({
    id: "",
    prepDate: "",
    mediaType: "",
    quantity: "",
    pH: "",
    preparedBy: "",
    status: "pending" as StatusType
  });
  
  const handleAddAutoclave = () => {
    if (autoclaveForm.id && autoclaveForm.date && autoclaveForm.batch) {
      dispatch(addAutoclaveRecord(autoclaveForm));
      setAutoclaveForm({
        id: "",
        date: "",
        batch: "",
        temperature: "",
        pressure: "",
        duration: "",
        status: "pending"
      });
      setIsAddAutoclaveModalOpen(false);
    }
  };
  
  const handleAddMediaBatch = () => {
    if (mediaForm.id && mediaForm.prepDate && mediaForm.mediaType) {
      dispatch(addMediaBatchRecord(mediaForm));
      setMediaForm({
        id: "",
        prepDate: "",
        mediaType: "",
        quantity: "",
        pH: "",
        preparedBy: "",
        status: "pending"
      });
      setIsAddMediaModalOpen(false);
    }
  };

  const stats = [
    { title: "Total Batches", value: mediaBatchRecords.length.toString(), icon: FlaskConical, trend: { value: "+12% this month", isPositive: true } },
    { title: "Active Batches", value: mediaBatchRecords.filter((b: any) => b.status === "active").length.toString(), icon: CheckCircle },
    { title: "Pending Autoclave", value: autoclaveRecords.filter((a: any) => a.status === "pending").length.toString(), icon: Clock },
    { title: "Contaminated", value: autoclaveRecords.filter((a: any) => a.status === "contaminated").length.toString(), icon: AlertTriangle, trend: { value: "-5% vs last month", isPositive: true } },
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
              <div className="flex gap-2">
                <Input placeholder="Search autoclave records..." className="max-w-xs" />
                <Dialog open={isAddAutoclaveModalOpen} onOpenChange={setIsAddAutoclaveModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                      <Plus className="w-4 h-4" />
                      Add Autoclave Cycle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Autoclave Cycle</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Autoclave ID</Label>
                        <Input 
                          placeholder="AC-XXX" 
                          value={autoclaveForm.id}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, id: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                          type="date"
                          value={autoclaveForm.date}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Batch No.</Label>
                        <Input 
                          placeholder="MB-2024-XXX"
                          value={autoclaveForm.batch}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, batch: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Temperature</Label>
                        <Input 
                          placeholder="121°C"
                          value={autoclaveForm.temperature}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, temperature: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pressure</Label>
                        <Input 
                          placeholder="15 PSI"
                          value={autoclaveForm.pressure}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, pressure: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input 
                          placeholder="20 min"
                          value={autoclaveForm.duration}
                          onChange={(e) => setAutoclaveForm({...autoclaveForm, duration: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={autoclaveForm.status} onValueChange={(value: any) => setAutoclaveForm({...autoclaveForm, status: value as StatusType})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="contaminated">Contaminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddAutoclaveModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleAddAutoclave}>
                        Save Cycle
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                  {autoclaveRecords.map((row: any) => (
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
              <div className="flex gap-2">
                <Input placeholder="Search media batches..." className="max-w-xs" />
                <Dialog open={isAddMediaModalOpen} onOpenChange={setIsAddMediaModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]">
                      <Plus className="w-4 h-4" />
                      Add Media Batch
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Media Batch</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Batch ID</Label>
                        <Input 
                          placeholder="MB-2024-XXX" 
                          value={mediaForm.id}
                          onChange={(e) => setMediaForm({...mediaForm, id: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prep Date</Label>
                        <Input 
                          type="date"
                          value={mediaForm.prepDate}
                          onChange={(e) => setMediaForm({...mediaForm, prepDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Media Type</Label>
                        <Select value={mediaForm.mediaType} onValueChange={(value: any) => setMediaForm({...mediaForm, mediaType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MS Medium">MS Medium</SelectItem>
                            <SelectItem value="WPM Medium">WPM Medium</SelectItem>
                            <SelectItem value="B5 Medium">B5 Medium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input 
                          placeholder="5L"
                          value={mediaForm.quantity}
                          onChange={(e) => setMediaForm({...mediaForm, quantity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>pH</Label>
                        <Input 
                          placeholder="5.8"
                          value={mediaForm.pH}
                          onChange={(e) => setMediaForm({...mediaForm, pH: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prepared By</Label>
                        <Input 
                          placeholder="Employee name"
                          value={mediaForm.preparedBy}
                          onChange={(e) => setMediaForm({...mediaForm, preparedBy: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={mediaForm.status} onValueChange={(value: any) => setMediaForm({...mediaForm, status: value as StatusType})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="contaminated">Contaminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddMediaModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleAddMediaBatch}>
                        Save Batch
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                  {mediaBatchRecords.map((row: any) => (
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
    </div>
  );
}
