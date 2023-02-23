import './App.css';
import pokedexService from './utils/pokedex.service';
import React, { useState, useMemo, useEffect } from 'react';
import { usePokemonByName } from './hooks';
import { Pokemon } from 'pokenode-ts';
import PokeSearch from './components/PokeSearch';

function App() {
  const { pokemon } = usePokemonByName();
  const [resolvedEvolutions, setResolvedEvolutions] = useState<Pokemon[]>([]);

  const areDetailsEnabled = !!(pokemon as Pokemon).name;

  const getEvolutionChain = () => {
    return pokedexService.fetchPokemonSpeciesByName((pokemon as Pokemon).name)
      .then(response => {
        if(response?.evolution_chain?.url) {
          return response.evolution_chain.url;
        } 
        else throw new Error('no evolution chain from url');
      })
      .then((pathUrl) => {
        return pokedexService.fetchPokedexResourceByEndpoint(pathUrl)
      })
      .then(evolutionChainResponse => {
        return evolutionChainResponse.chain
      })
  } 

  /**
   * Handle generating evolution chain
   */
  useEffect(() => {

    if ((pokemon as Pokemon)?.name) {
      getEvolutionChain()
        .then((evolutionChain) => {
          if (!evolutionChain.evolves_to) throw new Error('no evolution chain')
          let currentEvolution = evolutionChain;
          const evolutions = [];
          //form evolution map
          while (currentEvolution.evolves_to.length) {
            evolutions.push(currentEvolution.species)
            currentEvolution = currentEvolution.evolves_to[0];

          }
          evolutions.push(currentEvolution.species); //last poke

          const promises = evolutions.map(evolution => {
            return pokedexService.fetchPokedexResourceByEndpoint(evolution.url)
          })
          return Promise.all(promises)
        })
        .then(promiseResponses => {
          setResolvedEvolutions(promiseResponses);
        })
        .catch(err => {
          console.log("ERROR in evolutionChain: ", err)
        })
    }

  }, [pokemon])

  const pokemonIndexInChain = useMemo(() => {
    let idx = -1;
    resolvedEvolutions.forEach((evolution, index) => {
      if(evolution.name === (pokemon as Pokemon).name){
        idx = index;
        return;
      }
    })
    return idx;
  }, [pokemon, resolvedEvolutions])

  return (
    <div className="App">
      <div id='pokedex-body'>
        <PokeSearch
          areDetailsEnabled={areDetailsEnabled}
          pokemonIndexInChain={pokemonIndexInChain}
          resolvedEvolutions={resolvedEvolutions}
        />
        {areDetailsEnabled && 
          <div className='details'>
            DETAILS GO HERE
          </div>
        }

      </div>
    </div>
  );
}

export default App;
