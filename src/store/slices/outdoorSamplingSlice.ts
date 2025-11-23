import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface OutdoorSamplingRecord {
  id: string;
  date: string;
  batchID: string;
  stage: string;
  crop: string;
  sampleType: string;
  testType: string;
  result: string;
  testedBy: string;
  remarks: string;
  govVerified?: string;
  certNumber?: string;
  status: StatusType;
}

interface OutdoorSamplingState {
  records: OutdoorSamplingRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const initialState: OutdoorSamplingState = {
  records: [
    {
      id: "OS-2024-001",
      date: "2024-11-20",
      batchID: "PH-2024-001",
      stage: "Primary",
      crop: "Banana",
      sampleType: "Plant Health",
      testType: "Leaf Analysis",
      result: "Healthy",
      testedBy: "Field Tech A",
      remarks: "Normal chlorophyll levels",
      govVerified: "Yes",
      certNumber: "CERT-2024-001",
      status: "completed",
    },
    {
      id: "OS-2024-002",
      date: "2024-11-21",
      batchID: "SH-2024-001",
      stage: "Secondary",
      crop: "Bamboo",
      sampleType: "Soil Quality",
      testType: "pH & Nutrients",
      result: "Optimal",
      testedBy: "Field Tech B",
      remarks: "pH: 6.5, good nutrient balance",
      govVerified: "Yes",
      certNumber: "CERT-2024-002",
      status: "completed",
    },
    {
      id: "OS-2024-003",
      date: "2024-11-22",
      batchID: "PH-2024-003",
      stage: "Primary",
      crop: "Teak",
      sampleType: "Pest & Disease",
      testType: "Visual Inspection",
      result: "Minor pest detected",
      testedBy: "Field Tech A",
      remarks: "Treatment applied",
      govVerified: "No",
      certNumber: "",
      status: "active",
    },
    {
      id: "OS-2024-004",
      date: "2024-11-22",
      batchID: "SH-2024-004",
      stage: "Secondary",
      crop: "Ornamental",
      sampleType: "Water Quality",
      testType: "Contamination",
      result: "Bacterial presence",
      testedBy: "Field Tech C",
      remarks: "Irrigation system flushed",
      govVerified: "No",
      certNumber: "",
      status: "contaminated",
    },
  ],
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const outdoorSamplingSlice = createSlice({
  name: "outdoorSampling",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<OutdoorSamplingRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<OutdoorSamplingRecord>) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<StatusType | "all">) => {
      state.filterStatus = action.payload;
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    },
  },
});

export const {
  addRecord,
  updateRecord,
  deleteRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
} = outdoorSamplingSlice.actions;

export default outdoorSamplingSlice.reducer;
