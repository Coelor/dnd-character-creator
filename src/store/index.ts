import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import charactersReducer from './slices/charactersSlice';
import campaignsReducer from './slices/campaignsSlice';
import sessionsReducer from './slices/sessionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    campaigns: campaignsReducer,
    sessions: sessionsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;