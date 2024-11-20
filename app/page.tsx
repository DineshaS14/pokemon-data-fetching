'use client';
import { useState, useEffect, ChangeEvent } from "react";
// ChangeEvent provides type safety for event handlers

}
// Defining the structure of pokemon object that is same as API response
// to save in our state array
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  url?: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    }; // Added types to the Pokemon interface
  };
  weight?: number;

}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);

  useEffect(()=> {
    async function fetchData() {
      try{
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await response.json(); //comes with a link to each pokemon, need to extract indiv
        if (!response.ok) {
          throw new Error("Pokemons were not fetched");
        }
        const pokemonDataList: Pokemon[]  = [];
        for (const pokemon of data.results) {
          const individualPokemonResponse = await fetch(pokemon.url);
          const pokemonData = await individualPokemonResponse.json();
          pokemonDataList.push(pokemonData);
        } // for  
        setPokemonList(pokemonDataList);
        setFilteredPokemonList(pokemonDataList);
      } catch(error) {
        console.log("Error fetching data: ", error);
      } // try catch
    } // fetchData
    
    fetchData();
  }, [] );

  function handleFilterChange(event: ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
    setFilteredPokemonList(filtered);
  }
// Type color mapping (you can expand this for more types)
const typeColors: { [key: string]: string } = {
  grass: 'bg-green-500',
  poison: 'bg-purple-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-500',
  normal: 'bg-gray-500',
  // Add more types as needed
};
return (
  <div className="h-screen w-full bg-custom-bg bg-cover bg-center font-sans text-center ">
    <h1 className="text-5xl text-black font-bold italic py-4">Pokemon List</h1>
    <div>
      <input
        type="text"
        placeholder="Search Pokemon..."
        onChange={handleFilterChange}
        className="border-2 border-gray-300 p-2 rounded-md"
      />
    </div>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 p-4">
      {filteredPokemonList.map((pokemon) => (
        <li key={pokemon.id} className="pokemon bg-gray-100 border-3 border-gray-300 rounded-xl p-4 text-center">
          <p className="font-medium text-xl">
            {pokemon.id}. {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
          </p>

          <div className="flex items-center justify-center space-x-2 mt-2">
            {/* Display Weight */}
            <p className="font-small text-sm">Weight: {pokemon.weight}</p>

            {/* Display Types with dynamic colors */}
            {pokemon.types.map((typeObj, index) => {
              const type = typeObj.type.name; // Extract the type name
              return (
                <span
                  key={index}
                  className={`inline-block ${typeColors[type] || 'bg-gray-500'} text-white rounded-full px-2 py-1 text-sm`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize the type name */}
                </span>
              );
            })}
          </div>

          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mx-auto mt-2" />
        </li>
      ))}
    </ul>
  </div>
);
}