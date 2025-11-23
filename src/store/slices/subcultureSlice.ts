import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatusType = "pending" | "active" | "completed" | "contaminated";

export interface SubcultureRecord {
  id: string;
  date: string;
  sourceID: string;
  crop: string;
  variety: string;
  stage: string;
  explants: number;
  mediaUsed: string;
  technician: string;
  status: StatusType;
}

interface SubcultureState {
  records: SubcultureRecord[];
  searchTerm: string;
  filterStatus: StatusType | "all";
  editingId: string | null;
}

const initialState: SubcultureState = {
  records: [
    {
      id: "SC-2024-001",
      date: "2024-11-20",
      sourceID: "MB-2024-001",
      crop: "Banana",
      variety: "Grand Naine",
      stage: "Stage 1",
      explants: 25,
      mediaUsed: "MS Medium",
      technician: "Rajesh Kumar",
      status: "active",
    },
    {
      id: "SC-2024-002",
      date: "2024-11-21",
      sourceID: "MB-2024-002",
      crop: "Bamboo",
      variety: "Dendrocalamus",
      stage: "Stage 2",
      explants: 30,
      mediaUsed: "WPM Medium",
      technician: "Priya Sharma",
      status: "completed",
    },
    {
      id: "SC-2024-003",
      date: "2024-11-22",
      sourceID: "MB-2024-003",
      crop: "Teak",
      variety: "Tectona grandis",
      stage: "Stage 1",
      explants: 20,
      mediaUsed: "MS Medium",
      technician: "Amit Patel",
      status: "pending",
    },
    {
      id: "SC-2024-004",
      date: "2024-11-22",
      sourceID: "MB-2024-004",
      crop: "Ornamental",
      variety: "Anthurium",
      stage: "Stage 3",
      explants: 15,
      mediaUsed: "B5 Medium",
      technician: "Sunita Verma",
      status: "contaminated",
    },
  ],
  searchTerm: "",
  filterStatus: "all",
  editingId: null,
};

const subcultureSlice = createSlice({
  name: "subculture",
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<SubcultureRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<SubcultureRecord>) => {
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
} = subcultureSlice.actions;

export default subcultureSlice.reducer;
