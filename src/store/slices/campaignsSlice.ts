import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Campaign {
  id: string;
  owner_id: string;
  title: string;
  system: string;
  party: string[];
  invitations: {
    link_code: string;
    status: 'pending' | 'accepted';
  }[];
  sessions: string[];
  world_notes: string;
  npcs: unknown[];
  locations: unknown[];
  items: unknown[];
  metadata: {
    allow_homebrew: boolean;
    tags: string[];
  };
  created_at: string;
  updated_at: string;
}

interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  selectedCampaignId: string | null;
}

const initialState: CampaignsState = {
  campaigns: [],
  loading: false,
  error: null,
  selectedCampaignId: null,
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },
    setSelectedCampaign: (state, action: PayloadAction<string | null>) => {
      state.selectedCampaignId = action.payload;
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
  setCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  setSelectedCampaign,
  setLoading,
  setError,
} = campaignsSlice.actions;

export default campaignsSlice.reducer;