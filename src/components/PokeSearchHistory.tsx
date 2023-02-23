import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Menu } from '@mui/material';
import { usePokemonByName } from '../hooks';
import { Pokemon } from 'pokenode-ts';

export default () => {
    const { pokemon, getPokemonByName, pokemonCache } = usePokemonByName();
    
    const handleChange = (e: SelectChangeEvent) => {
      getPokemonByName(e.target.value);
    }
    return (
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id='search-history-label'>
          Pokemon History
        </InputLabel>
        <Select
          id='pokemon-history-select'
          value={(pokemon as Pokemon).name}
          label='Pokemon History'
          onChange={handleChange}
          disabled={pokemonCache.length === 0}
        >
        {
            pokemonCache.map(cacheEntry => {
              return (
                <MenuItem value={cacheEntry}>
                  {cacheEntry}
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    );
  }