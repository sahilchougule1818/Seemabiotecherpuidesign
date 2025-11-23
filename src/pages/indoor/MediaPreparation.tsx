import { useState, useMemo } from "react";
import { Plus, Filter, Download, Edit2, Trash2, Search } from "lucide-react";
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
import { 
  addAutoclaveRecord, 
  addMediaBatchRecord, 
  updateAutoclaveRecord, 
  deleteAutoclaveRecord,
  updateMediaBatchRecord,
  deleteMediaBatchRecord
} from "../../store/slices/mediaPreparationSlice";

export function MediaPreparation() {
  const dispatch = useAppDispatch();
  const { autoclaveRecords, mediaBatchRecords } = useAppSelector((state) => state.mediaPreparation);
  
  const [batchFilter, setBatchFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [isAddAutoclaveModalOpen, setIsAddAutoclaveModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isEditAutoclaveModalOpen, setIsEditAutoclaveModalOpen] = useState(false);
  const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);
  const [editingAutoclaveRecord, setEditingAutoclaveRecord] = useState<any>(null);
  const [editingMediaRecord, setEditingMediaRecord] = useState<any>(null);
  
  const [autoclaveForm, setAutoclaveForm] = useState({
    id: "",
    date: "",
    batch: "",
    temperature: "",
    pressure: "",
    duration: "",
    status: "pending" as StatusType
  });
  
  const [autoclaveEditForm, setAutoclaveEditForm] = useState({
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
  
  const [mediaEditForm, setMediaEditForm] = useState({
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

  const handleEditAutoclave = (record: any) => {
    setEditingAutoclaveRecord(record);
    setAutoclaveEditForm({
      id: record.id,
      date: record.date,
      batch: record.batch,
      temperature: record.temperature,
      pressure: record.pressure,
      duration: record.duration,
      status: record.status,
    });
    setIsEditAutoclaveModalOpen(true);
  };

  const handleSaveAutoclaveEdit = () => {
    if (autoclaveEditForm.id && autoclaveEditForm.date && autoclaveEditForm.batch) {
      dispatch(updateAutoclaveRecord(autoclaveEditForm));
      setEditingAutoclaveRecord(null);
      setAutoclaveEditForm({
        id: "",
        date: "",
        batch: "",
        temperature: "",
        pressure: "",
        duration: "",
        status: "pending"
      });
      setIsEditAutoclaveModalOpen(false);
    }
  };

  const handleDeleteAutoclave = (id: string) => {
    if (window.confirm("Are you sure you want to delete this autoclave record?")) {
      dispatch(deleteAutoclaveRecord(id));
    }
  };

  const handleDeleteAutoclaveFromEdit = () => {
    if (editingAutoclaveRecord) {
      dispatch(deleteAutoclaveRecord(editingAutoclaveRecord.id));
      setEditingAutoclaveRecord(null);
      setAutoclaveEditForm({
        id: "",
        date: "",
        batch: "",
        temperature: "",
        pressure: "",
        duration: "",
        status: "pending"
      });
      setIsEditAutoclaveModalOpen(false);
    }
  };

  const handleEditMedia = (record: any) => {
    setEditingMediaRecord(record);
    setMediaEditForm({
      id: record.id,
      prepDate: record.prepDate,
      mediaType: record.mediaType,
      quantity: record.quantity,
      pH: record.pH,
      preparedBy: record.preparedBy,
      status: record.status,
    });
    setIsEditMediaModalOpen(true);
  };

  const handleSaveMediaEdit = () => {
    if (mediaEditForm.id && mediaEditForm.prepDate && mediaEditForm.mediaType) {
      dispatch(updateMediaBatchRecord(mediaEditForm));
      setEditingMediaRecord(null);
      setMediaEditForm({
        id: "",
        prepDate: "",
        mediaType: "",
        quantity: "",
        pH: "",
        preparedBy: "",
        status: "pending"
      });
      setIsEditMediaModalOpen(false);
    }
  };

  const handleDeleteMedia = (id: string) => {
    if (window.confirm("Are you sure you want to delete this media batch record?")) {
      dispatch(deleteMediaBatchRecord(id));
    }
  };

  const handleDeleteMediaFromEdit = () => {
    if (editingMediaRecord) {
      dispatch(deleteMediaBatchRecord(editingMediaRecord.id));
      setEditingMediaRecord(null);
      setMediaEditForm({
        id: "",
        prepDate: "",
        mediaType: "",
        quantity: "",
        pH: "",
        preparedBy: "",
        status: "pending"
      });
      setIsEditMediaModalOpen(false);
    }
  };

  const handleAutoclaveEditModalClose = (open: boolean) => {
    setIsEditAutoclaveModalOpen(open);
    if (!open) {
      setEditingAutoclaveRecord(null);
      setAutoclaveEditForm({
        id: "",
        date: "",
        batch: "",
        temperature: "",
        pressure: "",
        duration: "",
        status: "pending"
      });
    }
  };

  const handleMediaEditModalClose = (open: boolean) => {
    setIsEditMediaModalOpen(open);
    if (!open) {
      setEditingMediaRecord(null);
      setMediaEditForm({
        id: "",
        prepDate: "",
        mediaType: "",
        quantity: "",
        pH: "",
        preparedBy: "",
        status: "pending"
      });
    }
  };

  const uniqueBatchCodes = useMemo(() => {
    const batches = new Set<string>();
    autoclaveRecords.forEach((record: any) => batches.add(record.batch));
    mediaBatchRecords.forEach((record: any) => batches.add(record.id));
    return Array.from(batches).sort();
  }, [autoclaveRecords, mediaBatchRecords]);

  const handleBatchFilter = () => {
    if (batchFilter) {
      setShowFiltered(true);
    }
  };

  const handleShowAllData = () => {
    setShowFiltered(false);
    setBatchFilter("");
  };

  const filteredAutoclaveRecords = useMemo(() => {
    return autoclaveRecords.filter((record: any) => {
      const matchesBatch = !showFiltered || record.batch === batchFilter || record.id === batchFilter;
      return matchesBatch;
    });
  }, [autoclaveRecords, batchFilter, showFiltered]);

  const filteredMediaRecords = useMemo(() => {
    return mediaBatchRecords.filter((record: any) => {
      const matchesBatch = !showFiltered || record.id === batchFilter;
      return matchesBatch;
    });
  }, [mediaBatchRecords, batchFilter, showFiltered]);

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

      {/* Search Panel */}
      <Card className="p-6 bg-white border-border/50">
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
      </Card>

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
                  {filteredAutoclaveRecords.map((row: any) => (
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
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAutoclave(row)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAutoclave(row.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                  {filteredMediaRecords.map((row: any) => (
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
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMedia(row)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMedia(row.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Autoclave Modal */}
      <Dialog open={isEditAutoclaveModalOpen} onOpenChange={handleAutoclaveEditModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Autoclave Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Autoclave ID</Label>
              <Input 
                placeholder="AC-XXX" 
                value={autoclaveEditForm.id}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, id: e.target.value})}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input 
                type="date"
                value={autoclaveEditForm.date}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Batch No.</Label>
              <Input 
                placeholder="MB-2024-XXX"
                value={autoclaveEditForm.batch}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, batch: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input 
                placeholder="121°C"
                value={autoclaveEditForm.temperature}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, temperature: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Pressure</Label>
              <Input 
                placeholder="15 PSI"
                value={autoclaveEditForm.pressure}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, pressure: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input 
                placeholder="20 min"
                value={autoclaveEditForm.duration}
                onChange={(e) => setAutoclaveEditForm({...autoclaveEditForm, duration: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={autoclaveEditForm.status} onValueChange={(value: any) => setAutoclaveEditForm({...autoclaveEditForm, status: value as StatusType})}>
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
          <div className="flex justify-between pt-4">
            <div>
              <Button variant="destructive" onClick={handleDeleteAutoclaveFromEdit}>
                Delete Entry
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditAutoclaveModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleSaveAutoclaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Media Batch Modal */}
      <Dialog open={isEditMediaModalOpen} onOpenChange={handleMediaEditModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Media Batch Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input 
                placeholder="MB-2024-XXX" 
                value={mediaEditForm.id}
                onChange={(e) => setMediaEditForm({...mediaEditForm, id: e.target.value})}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Prep Date</Label>
              <Input 
                type="date"
                value={mediaEditForm.prepDate}
                onChange={(e) => setMediaEditForm({...mediaEditForm, prepDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Media Type</Label>
              <Select value={mediaEditForm.mediaType} onValueChange={(value: any) => setMediaEditForm({...mediaEditForm, mediaType: value})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
                value={mediaEditForm.quantity}
                onChange={(e) => setMediaEditForm({...mediaEditForm, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>pH</Label>
              <Input 
                placeholder="5.8"
                value={mediaEditForm.pH}
                onChange={(e) => setMediaEditForm({...mediaEditForm, pH: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Prepared By</Label>
              <Input 
                placeholder="Employee name"
                value={mediaEditForm.preparedBy}
                onChange={(e) => setMediaEditForm({...mediaEditForm, preparedBy: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={mediaEditForm.status} onValueChange={(value: any) => setMediaEditForm({...mediaEditForm, status: value as StatusType})}>
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
          <div className="flex justify-between pt-4">
            <div>
              <Button variant="destructive" onClick={handleDeleteMediaFromEdit}>
                Delete Entry
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditMediaModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]" onClick={handleSaveMediaEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
