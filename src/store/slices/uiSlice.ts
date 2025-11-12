import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  searchOpen: boolean;
  searchQuery: string;
  levelUpDrawerOpen: boolean;
  levelUpCharacterId: string | null;
  exportModalOpen: boolean;
  exportType: 'json' | 'pdf' | 'markdown' | null;
  sidebarCollapsed: boolean;
}

const initialState: UIState = {
  searchOpen: false,
  searchQuery: '',
  levelUpDrawerOpen: false,
  levelUpCharacterId: null,
  exportModalOpen: false,
  exportType: null,
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
      if (!action.payload) {
        state.searchQuery = '';
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    openLevelUpDrawer: (state, action: PayloadAction<string>) => {
      state.levelUpDrawerOpen = true;
      state.levelUpCharacterId = action.payload;
    },
    closeLevelUpDrawer: (state) => {
      state.levelUpDrawerOpen = false;
      state.levelUpCharacterId = null;
    },
    openExportModal: (state, action: PayloadAction<'json' | 'pdf' | 'markdown'>) => {
      state.exportModalOpen = true;
      state.exportType = action.payload;
    },
    closeExportModal: (state) => {
      state.exportModalOpen = false;
      state.exportType = null;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const {
  setSearchOpen,
  setSearchQuery,
  openLevelUpDrawer,
  closeLevelUpDrawer,
  openExportModal,
  closeExportModal,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;