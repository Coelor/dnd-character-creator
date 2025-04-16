import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Character } from "../types/character";
import { CharacterAPI } from "../services/characterService";

interface CharacterState {
    characters: Character[];
    loading: boolean;
    error: string | null;
}

const initialState: CharacterState = {
    characters: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchCharacters = createAsyncThunk("characters/fetch", async () => {
    return await CharacterAPI.list();
});

export const createCharacter = createAsyncThunk("characters/create", async (char: Partial<Character>) => {
    await CharacterAPI.create(char);
    return await CharacterAPI.list(); // re-fetch list after creation
});

export const deleteCharacter = createAsyncThunk("characters/delete", async (id: string) => {
    await CharacterAPI.delete(id);
    return await CharacterAPI.list();
});

const characterSlice = createSlice({
    name: "characters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacters.fulfilled, (state, action: PayloadAction<Character[]>) => {
                state.loading = false;
                state.characters = action.payload;
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch characters";
            })

            // After create/delete: refresh list
            .addCase(createCharacter.fulfilled, (state, action: PayloadAction<Character[]>) => {
                state.characters = action.payload;
            })
            .addCase(deleteCharacter.fulfilled, (state, action: PayloadAction<Character[]>) => {
                state.characters = action.payload;
            });
    },
});

export default characterSlice.reducer;
