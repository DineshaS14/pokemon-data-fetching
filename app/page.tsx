'use client';
import { useState, useEffect } from "react";

// Define TypeScript interfaces for strict typing
// This interface describes the structure of each individual Pokemon's type.
interface PokemonType {
  slot: number; // The slot where the type appears in the list (can be used for sorting).
  type: {
    name: string; // The name of the type (e.g., "grass", "fire").
    url: string; // The API URL to fetch more information about this type.
  };
}

// This interface describes the structure of a single Pokemon.
interface Pokemon {
  id: number; // The ID of the Pokemon.
  name: string; // The name of the Pokemon.
  weight: number; // The weight of the Pokemon (used for display).
  sprites: {
    front_default: string; // URL for the front-facing image of the Pokemon.
  };
  types: PokemonType[]; // Array of `PokemonType` objects.
}

export default function App() {
  // State hooks with TypeScript type annotations
  // `pokemonList` holds all the Pokemon data fetched from the API
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  // `filteredPokemonList` holds the filtered list of Pokemon based on search input
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);

  // Effect hook to fetch data from the API on component mount
  useEffect(() => {
    // Async function to fetch the data from the PokeAPI
    async function fetchData() {
      try {
        // Fetch the first 25 Pokemon from the PokeAPI
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await response.json(); // Parse the response as JSON

        const pokemonDataList: Pokemon[] = []; // Array to store the detailed Pokemon data

        // Loop over each Pokemon from the API's `results` and fetch additional details
        for (const pokemon of data.results) {
          // Fetch each Pokemon's details
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json(); // Parse the individual Pokemon's details

          pokemonDataList.push(pokemonData); // Add the detailed Pokemon data to our list
        }

        // Set both `pokemonList` and `filteredPokemonList` to the detailed data
        setPokemonList(pokemonDataList);
        setFilteredPokemonList(pokemonDataList);
      } catch (error) {
        console.error("Error fetching data: ", error); // Log any errors
      }
    }

    fetchData(); // Call the async function to fetch data
  }, []); // Empty dependency array means this runs once when the component mounts

  // Event handler for search input changes
  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive comparison

    // Filter the list of Pokemon by name, matching the beginning of the name
    const filtered = pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase().startsWith(searchTerm); // Check if the name starts with the search term
    });

    // Update the filtered list
    setFilteredPokemonList(filtered);
  }

  return (
    <div className="h-screen w-full bg-[url('/pokedex.png')] bg-cover bg-center font-sans text-center">
      {/* Page Title */}
      <h1 className="text-3xl text-white py-4">Pokemon List</h1>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search Pokemon..."
          onChange={handleFilterChange} // Call the filter function when input changes
          className="border-2 border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Pokemon List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 p-4">
        {filteredPokemonList.map((pokemon) => (
          // Each Pokemon's info is displayed in a list item
          <li key={pokemon.id} className="pokemon bg-gray-100 border-3 border-gray-300 rounded-xl p-4 text-center">
            {/* Pokemon Name */}
            <p className="font-medium text-xl">
              {pokemon.id}. {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
            </p>

            {/* Pokemon Weight */}
            <p className="font-small text-sm">Weight: {pokemon.weight}</p>

            {/* Display Types with dynamic colors */}
            <div className="flex items-center justify-center space-x-2 mt-2">
              {pokemon.types.map((typeObj, index) => {
                const type = typeObj.type.name; // Extract the type name (e.g., "fire", "grass")

                // Tailwind class to dynamically apply colors based on the Pokemon's type
                // We use `typeColors[type]` to map each type to a specific background color
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

            {/* Pokemon Image */}
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mx-auto mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// TypeScript ensures that:
// - `pokemonList` is an array of `Pokemon` objects
// - `pokemon.types` is an array of `PokemonType` objects
// - Any reference to these properties will be type-checked, preventing bugs
// For example, trying to access `pokemon.types` as if it were a single object instead of an array will raise a TypeScript error

// `typeColors` is assumed to be an object that maps each type to a specific background color.
const typeColors: { [key: string]: string } = {
  grass: 'bg-green-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-500',
  // Add more types and their corresponding colors here
};
