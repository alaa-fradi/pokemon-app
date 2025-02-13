import { gql } from "@apollo/client";
import client from "../ApolloClient";

// Query to fetch Pokemons with filtering and sorting capabilities
const GET_POKEMONS = gql`
query GetPokemons(
$orderBy: order_by!, 
$limit: Int!, 
$offset: Int!, 
$searchQuery: String,
 $selectedStat: String,  
 $minStat: Int = 0,
 $maxStat: Int = 9999  
) {
  pokemon_v2_pokemon(
   where: {
      name: { _ilike: $searchQuery },
      pokemon_v2_pokemonstats: {
        pokemon_v2_stat: { name: { _eq: $selectedStat } },
        base_stat: {
          _gte: $minStat,
          _lte: $maxStat
        }
      }
    }
  order_by: { name: $orderBy }, 
  limit: $limit, 
  offset: $offset
  ) {
    id
    name
    height
    weight
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        id
        name
      }
    }
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemonabilities {
      pokemon_v2_ability {
        name
      }
    }
    pokemon_v2_pokemonmoves(limit: 4) {
        pokemon_v2_move {
        name
        }
    }
    pokemon_v2_pokemonspecy {
        pokemon_v2_pokemoncolor {
            name
        }
        pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies {
                name
            }
        }
        pokemon_v2_pokemonspeciesflavortexts(
            where: { language_id: { _eq: 9 } }
            limit: 1
        ) {
            flavor_text
        }
    }
  
  }
}
`;
// Function to fetch Pokémon data from the GraphQL API
export const fetchPokemons = async (
  orderBy: "asc" | "desc",  // Sort order (ascending or descending)
  limit: number,  // Number of Pokémon to fetch per request
  offset: number, // Pagination offset
  searchQuery: string = "",  // Search query to filter Pokémon by name (optional)
  selectedStat: string = "hp",  // Stat used for filtering (default is 'hp')
  minStat: string | number = "",  // Minimum value for the stat filter (optional)
  maxStat: string | number = ""   // Maximum value for the stat filter (optional)
) => {
  try {
    // Format the search query to allow for partial matches with '%' wildcard
    const formattedSearchQuery = searchQuery ? `%${searchQuery}%` : "%";

    // Define the variables to pass to the GraphQL query
    const variables = {
      orderBy,
      limit,
      offset,
      searchQuery: formattedSearchQuery,
      selectedStat: selectedStat || null, // Stat used for filtering (default is null if not provided)
      minStat: minStat !== "" ? Number(minStat) : 0,   // Default to 0 if empty
      maxStat: maxStat !== "" ? Number(maxStat) : 9999 // Default to 9999 if empty

    };

    // Execute the query with the defined variables and return the Pokémon data
    const { data } = await client.query({
      query: GET_POKEMONS,
      variables,
    });

    return data.pokemon_v2_pokemon;
  } catch (error) {
    console.error("Error fetching Pokémons:", error);
    return [];
  }
};
