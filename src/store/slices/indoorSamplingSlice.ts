import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface IndoorSamplingRecord {
  id: string;
  date: string;
  batchID: string;
  sampleType: string;
  testType: string;
  result: string;
  testedBy: string;
  remarks: string;
  govVerified?: string;
  certNumber?: string;
  status: StatusType;
}

interface IndoorSamplingState {
  records: IndoorSamplingRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: IndoorSamplingRecord[] = [
  {
    id: "IS-2024-001",
    date: "2024-11-20",
    batchID: "SC-2024-001",
    sampleType: "Contamination Check",
    testType: "Visual Inspection",
    result: "Clean",
    testedBy: "Lab Tech A",
    remarks: "No signs of contamination",
    govVerified: "Yes",
    certNumber: "CERT-IN-2024-001",
    status: "completed",
  },
  {
    id: "IS-2024-002",
    date: "2024-11-21",
    batchID: "SC-2024-002",
    sampleType: "Growth Rate",
    testType: "Microscopy",
    result: "Normal",
    testedBy: "Lab Tech B",
    remarks: "Healthy cell division observed",
    govVerified: "Yes",
    certNumber: "CERT-IN-2024-002",
    status: "completed",
  },
  {
    id: "IS-2024-003",
    date: "2024-11-22",
    batchID: "SC-2024-003",
    sampleType: "Contamination Check",
    testType: "Culture Test",
    result: "Suspicious",
    testedBy: "Lab Tech A",
    remarks: "Requires further testing",
    govVerified: "No",
    certNumber: "",
    status: "active",
  },
];

const initialState: IndoorSamplingState = {
  records: loadFromLocalStorage<IndoorSamplingRecord[]>(STORAGE_KEYS.INDOOR_SAMPLING_RECORDS, defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const indoorSamplingSlice = createSlice({
  name: "indoorSampling",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<IndoorSamplingRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<IndoorSamplingRecord>) => {
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
} = indoorSamplingSlice.actions;

export default indoorSamplingSlice.reducer;
