import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../utils/loadFromLocalStorage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface AutoclaveRecord {
  id: string;
  date: string;
  batch: string;
  temperature: string;
  pressure: string;
  duration: string;
  status: StatusType;
}

export interface MediaBatchRecord {
  id: string;
  prepDate: string;
  mediaType: string;
  quantity: string;
  pH: string;
  preparedBy: string;
  status: StatusType;
}

interface MediaPreparationState {
  autoclaveRecords: AutoclaveRecord[];
  mediaBatchRecords: MediaBatchRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const defaultAutoclaveRecords: AutoclaveRecord[] = [
  { id: "AC-001", date: "2024-11-20", batch: "MB-2024-001", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "completed" },
  { id: "AC-002", date: "2024-11-21", batch: "MB-2024-002", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "active" },
  { id: "AC-003", date: "2024-11-22", batch: "MB-2024-003", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "pending" },
  { id: "AC-004", date: "2024-11-22", batch: "MB-2024-004", temperature: "121°C", pressure: "15 PSI", duration: "20 min", status: "contaminated" },
];

const defaultMediaBatchRecords: MediaBatchRecord[] = [
  { id: "MB-2024-001", prepDate: "2024-11-18", mediaType: "MS Medium", quantity: "5L", pH: "5.8", preparedBy: "Rajesh Kumar", status: "completed" },
  { id: "MB-2024-002", prepDate: "2024-11-19", mediaType: "WPM Medium", quantity: "3L", pH: "5.7", preparedBy: "Priya Sharma", status: "active" },
  { id: "MB-2024-003", prepDate: "2024-11-20", mediaType: "MS Medium", quantity: "4L", pH: "5.8", preparedBy: "Amit Patel", status: "pending" },
];

const initialState: MediaPreparationState = {
  autoclaveRecords: loadFromLocalStorage<AutoclaveRecord[]>(STORAGE_KEYS.AUTOCLAVE_RECORDS, defaultAutoclaveRecords),
  mediaBatchRecords: loadFromLocalStorage<MediaBatchRecord[]>(STORAGE_KEYS.MEDIA_BATCH_RECORDS, defaultMediaBatchRecords),
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const mediaPreparationSlice = createSlice({
  name: "mediaPreparation",
  initialState,
  reducers: {
    addAutoclaveRecord: (state, action: PayloadAction<AutoclaveRecord>) => {
      state.autoclaveRecords.push(action.payload);
    },
    updateAutoclaveRecord: (state, action: PayloadAction<AutoclaveRecord>) => {
      const index = state.autoclaveRecords.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.autoclaveRecords[index] = action.payload;
      }
    },
    deleteAutoclaveRecord: (state, action: PayloadAction<string>) => {
      state.autoclaveRecords = state.autoclaveRecords.filter((r) => r.id !== action.payload);
    },
    addMediaBatchRecord: (state, action: PayloadAction<MediaBatchRecord>) => {
      state.mediaBatchRecords.push(action.payload);
    },
    updateMediaBatchRecord: (state, action: PayloadAction<MediaBatchRecord>) => {
      const index = state.mediaBatchRecords.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.mediaBatchRecords[index] = action.payload;
      }
    },
    deleteMediaBatchRecord: (state, action: PayloadAction<string>) => {
      state.mediaBatchRecords = state.mediaBatchRecords.filter((r) => r.id !== action.payload);
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
  addAutoclaveRecord,
  updateAutoclaveRecord,
  deleteAutoclaveRecord,
  addMediaBatchRecord,
  updateMediaBatchRecord,
  deleteMediaBatchRecord,
  setSearchTerm,
  setFilterStatus,
  setEditingId,
} = mediaPreparationSlice.actions;

export default mediaPreparationSlice.reducer;
