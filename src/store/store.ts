import { configureStore } from "@reduxjs/toolkit";
import subcultureReducer from "./slices/subcultureSlice";
import incubationReducer from "./slices/incubationSlice";
import secondaryHardeningReducer from "./slices/secondaryHardeningSlice";
import holdingAreaReducer from "./slices/holdingAreaSlice";
import outdoorSamplingReducer from "./slices/outdoorSamplingSlice";

export const store = configureStore({
  reducer: {
    subculture: subcultureReducer,
    incubation: incubationReducer,
    secondaryHardening: secondaryHardeningReducer,
    holdingArea: holdingAreaReducer,
    outdoorSampling: outdoorSamplingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
