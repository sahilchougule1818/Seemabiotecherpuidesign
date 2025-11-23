import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const localStorageMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  const state = store.getState();
  
  try {
    localStorage.setItem('subculture_records', JSON.stringify(state.subculture.records));
    localStorage.setItem('incubation_records', JSON.stringify(state.incubation.records));
    localStorage.setItem('secondaryHardening_records', JSON.stringify(state.secondaryHardening.records));
    localStorage.setItem('holdingArea_records', JSON.stringify(state.holdingArea.records));
    localStorage.setItem('outdoorSampling_records', JSON.stringify(state.outdoorSampling.records));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return result;
};
