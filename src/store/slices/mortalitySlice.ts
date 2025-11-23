import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface MortalityRecord {
  id: string;
  date: string;
  batchID: string;
  crop: string;
  stage: string;
  initialCount: number;
  mortality: number;
  mortalityRate: string;
  cause: string;
  action: string;
  status: StatusType;
}

interface MortalityState {
  records: MortalityRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: MortalityRecord[] = [
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
    status: "active",
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
    status: "completed",
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
    status: "contaminated",
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
    status: "completed",
  },
];

const initialState: MortalityState = {
  records: loadFromLocalStorage<MortalityRecord[]>(STORAGE_KEYS.MORTALITY_RECORDS, defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const mortalitySlice = createSlice({
  name: "mortality",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<MortalityRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<MortalityRecord>) => {
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
} = mortalitySlice.actions;

export default mortalitySlice.reducer;
