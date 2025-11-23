import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface IncubationRecord {
  id: string;
  batchID: string;
  startDate: string;
  duration: string;
  temperature: string;
  light: string;
  humidity: string;
  chamber: string;
  observations: string;
  status: StatusType;
}

interface IncubationState {
  records: IncubationRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: IncubationRecord[] = [
    {
      id: "INC-2024-001",
      batchID: "SC-2024-001",
      startDate: "2024-11-15",
      duration: "14 days",
      temperature: "25°C",
      light: "16h/day",
      humidity: "60%",
      chamber: "IC-01",
      observations: "Normal growth",
      status: "active",
    },
    {
      id: "INC-2024-002",
      batchID: "SC-2024-002",
      startDate: "2024-11-16",
      duration: "14 days",
      temperature: "25°C",
      light: "16h/day",
      humidity: "60%",
      chamber: "IC-02",
      observations: "Excellent response",
      status: "completed",
    },
    {
      id: "INC-2024-003",
      batchID: "SC-2024-003",
      startDate: "2024-11-18",
      duration: "14 days",
      temperature: "25°C",
      light: "16h/day",
      humidity: "58%",
      chamber: "IC-01",
      observations: "Monitoring required",
      status: "pending",
    },
    {
      id: "INC-2024-004",
      batchID: "SC-2024-004",
      startDate: "2024-11-19",
      duration: "7 days",
      temperature: "26°C",
      light: "16h/day",
      humidity: "65%",
      chamber: "IC-03",
      observations: "Temperature fluctuation",
      status: "contaminated",
    },
  ];

const initialState: IncubationState = {
  records: loadFromLocalStorage<IncubationRecord[]>('incubation_records', defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const incubationSlice = createSlice({
  name: "incubation",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<IncubationRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<IncubationRecord>) => {
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
} = incubationSlice.actions;

export default incubationSlice.reducer;
