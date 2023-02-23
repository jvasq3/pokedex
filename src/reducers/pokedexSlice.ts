import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import pokedexService from '../utils/pokedex.service';
import { Pokemon } from 'pokenode-ts';

interface PokemonError {
    status: number;
    message: string;
    type: 'error' | 'warning'
};

interface PokemonState {
    pokemon: Pokemon | {};
    cache: string[];
    error: PokemonError | null;
    status: 'idle' | 'loading' | 'failed';
}
const initialState: PokemonState = {
    pokemon: {},
    cache: [],
    error: null,
    status: 'idle'
};

export const fetchPokemonByName = createAsyncThunk(
  'pokedex/fetchPokemonByName',
  async (name: string) => {
    //TODO handle error try/catch
    const response = await pokedexService.fetchPokemonByName(name);    
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const pokemonSlice = createSlice({
  name: 'pokedex',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updatePokemon: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers
      state.pokemon = action.payload;
    },
    updateCache: (state, action) => {
        state.cache = action.payload;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonByName.pending, (state) => {
        state.status = 'loading'; // TODO for loading states
      })
      .addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.status = 'idle';
        state.pokemon = action.payload;
        const name = action.payload.name;
        
        if(!state.cache.includes(name)) {
          state.cache = [
            ...state.cache,
            name
          ]
        }
      })
  },
});

export const { updateCache, updatePokemon } = pokemonSlice.actions;

export const selectPokemon = (state: RootState) => state.pokedex.pokemon

export const selectCache = (state: RootState): PokemonState['cache'] => {
  return state.pokedex.cache;
}

export default pokemonSlice.reducer;
