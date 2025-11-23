import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface PrimaryHardeningRecord {
  id: string;
  date: string;
  batchName: string;
  crop: string;
  tunnel: string;
  bed: string;
  row: string;
  cavity: string;
  plants: number;
  workers: number;
  waitingPeriod: string;
  status: StatusType;
}

interface PrimaryHardeningState {
  records: PrimaryHardeningRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: PrimaryHardeningRecord[] = [
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
    status: "active",
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
    status: "active",
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
    status: "pending",
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
    status: "completed",
  },
];

const initialState: PrimaryHardeningState = {
  records: loadFromLocalStorage<PrimaryHardeningRecord[]>(STORAGE_KEYS.PRIMARY_HARDENING_RECORDS, defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const primaryHardeningSlice = createSlice({
  name: "primaryHardening",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<PrimaryHardeningRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<PrimaryHardeningRecord>) => {
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
} = primaryHardeningSlice.actions;

export default primaryHardeningSlice.reducer;
