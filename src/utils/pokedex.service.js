import { MainClient, UtilityClient } from "pokenode-ts";
const mc = new MainClient();
const uc = new UtilityClient();

const fetchPokemonSpeciesByName = (name) => mc.pokemon.getPokemonSpeciesByName(name);
const fetchPokemonByName = (name) => mc.pokemon.getPokemonByName(name);
const fetchEvolutionChainById = (id) =>  mc.evolution.getEvolutionChainById(id)
const fetchPokedexResourceByEndpoint = (path) => uc.getResourceByUrl(path);

export default {
    fetchEvolutionChainById,
    fetchPokemonByName,
    fetchPokemonSpeciesByName,
    fetchPokedexResourceByEndpoint

}