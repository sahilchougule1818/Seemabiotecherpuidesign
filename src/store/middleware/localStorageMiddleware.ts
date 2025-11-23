import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const localStorageMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  if (typeof window === 'undefined' || !window.localStorage) {
    return result;
  }
  
  const state = store.getState();
  
  try {
    localStorage.setItem(STORAGE_KEYS.SUBCULTURE_RECORDS, JSON.stringify(state.subculture.records));
    localStorage.setItem(STORAGE_KEYS.INCUBATION_RECORDS, JSON.stringify(state.incubation.records));
    localStorage.setItem(STORAGE_KEYS.SECONDARY_HARDENING_RECORDS, JSON.stringify(state.secondaryHardening.records));
    localStorage.setItem(STORAGE_KEYS.HOLDING_AREA_RECORDS, JSON.stringify(state.holdingArea.records));
    localStorage.setItem(STORAGE_KEYS.OUTDOOR_SAMPLING_RECORDS, JSON.stringify(state.outdoorSampling.records));
    localStorage.setItem(STORAGE_KEYS.AUTOCLAVE_RECORDS, JSON.stringify(state.mediaPreparation.autoclaveRecords));
    localStorage.setItem(STORAGE_KEYS.MEDIA_BATCH_RECORDS, JSON.stringify(state.mediaPreparation.mediaBatchRecords));
    localStorage.setItem(STORAGE_KEYS.PRIMARY_HARDENING_RECORDS, JSON.stringify(state.primaryHardening.records));
    localStorage.setItem(STORAGE_KEYS.MORTALITY_RECORDS, JSON.stringify(state.mortality.records));
    localStorage.setItem(STORAGE_KEYS.INDOOR_SAMPLING_RECORDS, JSON.stringify(state.indoorSampling.records));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return result;
};
