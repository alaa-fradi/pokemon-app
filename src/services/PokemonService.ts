import { gql } from "@apollo/client";
import client from "../ApolloClient"; // Import the shared Apollo Client
/*
export const GET_POKEMONS = gql`
  query getPokemons($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      id
      name
    }
  }
`;
*/
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
  order_by: { id: $orderBy }, 
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

const GET_POKEMONS_Types = gql`
query GetPokemons {
   pokemon_v2_type {
    id
    name
  }
}
`;

export const fetchPokemons = async (
  orderBy: "asc" | "desc",
  limit: number,
  offset: number,
  searchQuery: string = "",
  selectedStat: string = "hp",
  minStat: string | number = "",   // Allow string or number
  maxStat: string | number = ""    // Allow string or number

) => {
  try {
    const formattedSearchQuery = searchQuery ? `%${searchQuery}%` : "%";

    // Only include the stat filters if they have values
    const variables = {
      orderBy,
      limit,
      offset,
      searchQuery: formattedSearchQuery,
      selectedStat: selectedStat || null,
      minStat: minStat !== "" ? Number(minStat) : 0,   // Default to 0 if empty
      maxStat: maxStat !== "" ? Number(maxStat) : 9999 // Default to 9999 if empty

    };

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

export const fetchPokemonsTypes = async () => {
  try {
    const { data } = await client.query({
      query: GET_POKEMONS_Types,
    });
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    return [];
  }
};