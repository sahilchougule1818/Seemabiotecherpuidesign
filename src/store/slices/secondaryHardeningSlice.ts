import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface SecondaryHardeningRecord {
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
  survivability: string;
  status: StatusType;
}

interface SecondaryHardeningState {
  records: SecondaryHardeningRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: SecondaryHardeningRecord[] = [
    {
      id: "SH-2024-001",
      date: "2024-11-10",
      batchName: "Banana-GN-Oct",
      crop: "Banana",
      tunnel: "SH-T1",
      bed: "SB1",
      row: "SR1-SR4",
      cavity: "72",
      plants: 2000,
      workers: 3,
      waitingPeriod: "21 days",
      survivability: "96%",
      status: "completed",
    },
    {
      id: "SH-2024-002",
      date: "2024-11-12",
      batchName: "Bamboo-DC-Oct",
      crop: "Bamboo",
      tunnel: "SH-T2",
      bed: "SB2",
      row: "SR1-SR3",
      cavity: "72",
      plants: 1500,
      workers: 2,
      waitingPeriod: "28 days",
      survivability: "94%",
      status: "active",
    },
    {
      id: "SH-2024-003",
      date: "2024-11-15",
      batchName: "Teak-TG-Oct",
      crop: "Teak",
      tunnel: "SH-T1",
      bed: "SB3",
      row: "SR1-SR5",
      cavity: "50",
      plants: 2200,
      workers: 3,
      waitingPeriod: "35 days",
      survivability: "92%",
      status: "active",
    },
    {
      id: "SH-2024-004",
      date: "2024-11-18",
      batchName: "Ornamental-A-Oct",
      crop: "Ornamental",
      tunnel: "SH-T3",
      bed: "SB1",
      row: "SR1-SR4",
      cavity: "40",
      plants: 1800,
      workers: 3,
      waitingPeriod: "21 days",
      survivability: "89%",
      status: "pending",
    },
  ];

const initialState: SecondaryHardeningState = {
  records: loadFromLocalStorage<SecondaryHardeningRecord[]>('secondaryHardening_records', defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const secondaryHardeningSlice = createSlice({
  name: "secondaryHardening",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<SecondaryHardeningRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<SecondaryHardeningRecord>) => {
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
} = secondaryHardeningSlice.actions;

export default secondaryHardeningSlice.reducer;
