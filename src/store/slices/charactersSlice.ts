import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../../types/character';

interface CharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  selectedCharacterId: string | null;
}

const initialState: CharactersState = {
  characters: [],
  loading: false,
  error: null,
  selectedCharacterId: null,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push(action.payload);
    },
    updateCharacter: (state, action: PayloadAction<Character>) => {
      const index = state.characters.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.characters[index] = action.payload;
      }
    },
    deleteCharacter: (state, action: PayloadAction<string>) => {
      state.characters = state.characters.filter(c => c.id !== action.payload);
    },
    setSelectedCharacter: (state, action: PayloadAction<string | null>) => {
      state.selectedCharacterId = action.payload;
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
  setCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  setSelectedCharacter,
  setLoading,
  setError,
} = charactersSlice.actions;

export default charactersSlice.reducer;