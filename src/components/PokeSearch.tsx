import React, { useState } from 'react';

import { TextField, Button, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PokeSearchHistory from './PokeSearchHistory';

import { usePokemonByName } from '../hooks';
import { Pokemon } from 'pokenode-ts';

type Direction = 'left' | 'right';
interface PokeSearchProps {
    areDetailsEnabled: boolean;
    pokemonIndexInChain: number;
    resolvedEvolutions: Pokemon[]
}

export default (props: PokeSearchProps) => {
    const [lookupName, setLookupName] = useState(''); //TODO should connect to redux store to set on history change

    const {
        areDetailsEnabled,
        pokemonIndexInChain,
        resolvedEvolutions
    } = props;
    const { pokemon, getPokemonByName, pokemonImg, } = usePokemonByName();

    const handlePokemonToggle = (direction: Direction) => {
        let newName;
        if (direction === 'left') {
            newName = resolvedEvolutions[pokemonIndexInChain - 1].name
            getPokemonByName(newName)
            setLookupName(newName)
        }
        else if (direction === 'right') {
            newName = resolvedEvolutions[pokemonIndexInChain + 1].name
            getPokemonByName(newName)
            setLookupName(newName)
        }
    }

    const handleSearch = () => {
        getPokemonByName(lookupName);
    }
    return (
        <div className='search-area'>
            <div className='image-area'>
                <div style={{ minWidth: 200, height: 200 }}>
                    {areDetailsEnabled && <img alt='pokemon' width='200' height='200' src={pokemonImg}></img>}
                    {areDetailsEnabled && (
                        <div>
                            <IconButton
                                onClick={() => {
                                    handlePokemonToggle('left');
                                }} disabled={Boolean(pokemon && pokemonIndexInChain === 0)}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton onClick={() => {
                                handlePokemonToggle('right');
                            }} disabled={Boolean(pokemon && pokemonIndexInChain === (resolvedEvolutions.length - 1))}>
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </div>
                    )}
                </div>
                <PokeSearchHistory />
            </div>
            <div className='name-area'>
                <TextField
                    id="name-textfield"
                    label="Name"
                    variant="outlined"
                    sx={{
                        width: 300
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    onChange={(e) => setLookupName(e.target.value.toLowerCase())}
                    value={lookupName}
                />
                <Button onClick={() => handleSearch()} variant="contained">Search</Button>
            </div>
        </div>

    )
}