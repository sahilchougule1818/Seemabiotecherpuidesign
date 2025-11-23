import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface HoldingAreaRecord {
  id: string;
  date: string;
  batchID: string;
  crop: string;
  variety: string;
  quantity: number;
  location: string;
  daysinHolding: number;
  condition: string;
  dispatchDate: string;
  status: StatusType;
}

interface HoldingAreaState {
  records: HoldingAreaRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultRecords: HoldingAreaRecord[] = [
    {
      id: "HA-2024-001",
      date: "2024-11-18",
      batchID: "SH-2024-001",
      crop: "Banana",
      variety: "Grand Naine",
      quantity: 1950,
      location: "Zone A-1",
      daysinHolding: 3,
      condition: "Excellent",
      dispatchDate: "2024-11-25",
      status: "active",
    },
    {
      id: "HA-2024-002",
      date: "2024-11-16",
      batchID: "SH-2024-002",
      crop: "Bamboo",
      variety: "Dendrocalamus",
      quantity: 1450,
      location: "Zone A-2",
      daysinHolding: 5,
      condition: "Good",
      dispatchDate: "2024-11-23",
      status: "completed",
    },
    {
      id: "HA-2024-003",
      date: "2024-11-20",
      batchID: "SH-2024-003",
      crop: "Teak",
      variety: "Tectona grandis",
      quantity: 2040,
      location: "Zone B-1",
      daysinHolding: 1,
      condition: "Excellent",
      dispatchDate: "2024-11-28",
      status: "pending",
    },
    {
      id: "HA-2024-004",
      date: "2024-11-19",
      batchID: "SH-2024-004",
      crop: "Ornamental",
      variety: "Anthurium",
      quantity: 1600,
      location: "Zone B-2",
      daysinHolding: 2,
      condition: "Good",
      dispatchDate: "2024-11-26",
      status: "active",
    },
  ];

const initialState: HoldingAreaState = {
  records: loadFromLocalStorage<HoldingAreaRecord[]>(STORAGE_KEYS.HOLDING_AREA_RECORDS, defaultRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const holdingAreaSlice = createSlice({
  name: "holdingArea",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<HoldingAreaRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<HoldingAreaRecord>) => {
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
} = holdingAreaSlice.actions;

export default holdingAreaSlice.reducer;
