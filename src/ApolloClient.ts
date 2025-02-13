import { ApolloClient, InMemoryCache } from "@apollo/client";

// Create an instance of ApolloClient to interact with the GraphQL API
const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",  // GraphQL API endpoint for Pokémon data
    cache: new InMemoryCache(),  // Initialize an in-memory cache to store fetched data
});

export default client;