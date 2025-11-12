import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Session {
  id: string;
  campaign_id: string;
  date: string;
  title: string;
  agenda: string;
  notes: string;
  encounters: unknown[];
  loot: unknown[];
  attachments: string[];
  created_at: string;
  updated_at: string;
}

interface SessionsState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  selectedSessionId: string | null;
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
  error: null,
  selectedSessionId: null,
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
    },
    setSelectedSession: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSessions,
  addSession,
  updateSession,
  deleteSession,
  setSelectedSession,
  setLoading,
  setError,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;