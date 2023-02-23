import { useMemo } from 'react';
import { Pokemon } from 'pokenode-ts';
import {
  fetchPokemonByName,
  selectPokemon,
  selectCache,
  updatePokemon
} from '../reducers/pokedexSlice';


import { useAppSelector, useAppDispatch } from '../app/hooks';

export const usePokemonByName = () => {
    //REDUX
    const pokemon = useAppSelector(selectPokemon);
    const pokemonCache = useAppSelector(selectCache);
    const dispatch = useAppDispatch();
    
    const resetPokemon = () => {
      dispatch(updatePokemon({}))
    }
  
    const pokemonImg = useMemo(() => {
      return (pokemon as Pokemon)?.sprites?.front_default ?? ''
    }, [pokemon])
  
    const getPokemonByName = (name: string) => {
        dispatch(fetchPokemonByName(name))
    }
  
    return {
      pokemon,
      pokemonCache,
      getPokemonByName,
      pokemonImg
    }
  }