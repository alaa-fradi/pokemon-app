import { useEffect, useState } from "react";
import { fetchPokemons } from "../services/PokemonService";
import PokemonCard from "./PokemonCard";
import pokemonBall from "../assets/pokemonBall.jpg";

// Define the structure of the types
interface PokemonType {
    id: number;
    name: string;
}

const PokemonList = () => {
    // State hooks 
    const [pokemons, setPokemons] = useState<any[]>([]); // Pokémon data to be displayed
    const [pokemonsData, setPokemonsData] = useState<any[]>([]); // Raw data from the API
    const [loading, setLoading] = useState(true); // Loading state for when the data is being fetched
    const [page, setPage] = useState(1); // Pagination state
    const limit = 16; // Number of Pokémon per page
    const [order, setOrder] = useState<"asc" | "desc">("asc"); // Sorting order (ascending/descending)
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(0); // Filter Pokémon by type
    const [allTypes, setAllTypes] = useState<PokemonType[]>([]); // All available Pokémon types
    const [sortBy, setSortBy] = useState<"name" | "hp" | "attack" | "defense">("name"); // Sort criteria
    const [searchQuery, setSearchQuery] = useState(""); // Search query for Pokémon names
    const [selectedStat, setSelectedStat] = useState<"hp" | "attack" | "defense">("hp"); // Stat selection for sorting
    const [minStat, setMinStat] = useState<number | "">(""); // Minimum stat value for filtering
    const [maxStat, setMaxStat] = useState<number | "">(""); // Maximum stat value for filtering

    // Function to get the stat value of a specific stat for a Pokémon (like HP, Attack, etc.)
    const getStat = (pokemonData: any, statName: string) => {
        const stat = pokemonData.pokemon_v2_pokemonstats.find((s: any) => s.pokemon_v2_stat.name === statName);
        return stat ? stat.base_stat : null;
    };

    // Extract detailed information from the Pokémon data to be used in display
    const extractPokemonDetails = (pokemonData: any) => {
        const name = pokemonData.name;
        const height = pokemonData.height;
        const weight = pokemonData.weight;
        const hp = getStat(pokemonData, 'hp');
        const types = pokemonData.pokemon_v2_pokemontypes.map((type: any) => type.pokemon_v2_type.name);
        const description = pokemonData.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') || '';
        const attack = getStat(pokemonData, 'attack');
        const defense = getStat(pokemonData, 'defense');
        const specialAttackDescription = getStat(pokemonData, 'special-attack');
        const color = pokemonData.pokemon_v2_pokemonspecy.pokemon_v2_pokemoncolor?.name || 'transparent';

        return {
            name,
            height,
            weight,
            hp,
            types,
            description,
            attack,
            defense,
            specialAttackDescription,
            color,
        };
    };

    // Handle search functionality when search button is clicked
    const handleSearch = async () => {
        setLoading(true);
        setSelectedTypeId(0);
        setSortBy("name");

        const offset = (page - 1) * limit; // Calculate the offset for pagination based on the current page and limit
        const pokemonsData = await fetchPokemons(order, limit, offset, searchQuery, selectedStat, minStat, maxStat); // Fetch the Pokémon data based on different criteria
        setPokemonsData(pokemonsData);

        // Extracting detailed information and sorting it
        const detailedPokemons = pokemonsData.map((pokemon: any) => extractPokemonDetails(pokemon)).sort((a: any, b: any) => {
            return a.name.localeCompare(b.name);
        });
        setPokemons(detailedPokemons);

        setLoading(false);
    };

    // Fetch initial Pokémon data when the component mounts or when page/order changes
    useEffect(() => {
        const getPokemons = async () => {
            setLoading(true);

            // Reset the selected type filter to "All" (0) and set the sorting to "name"
            setSelectedTypeId(0);
            setSortBy("name");

            const offset = (page - 1) * limit;

            const pokemonsData = await fetchPokemons(order, limit, offset, searchQuery, selectedStat, minStat, maxStat); // Fetch the Pokémon data based on different criteria
            setPokemonsData(pokemonsData);

            // Process the data as needed
            const detailedPokemons = pokemonsData.map((pokemon: any) => extractPokemonDetails(pokemon)).sort((a: any, b: any) => {
                return a.name.localeCompare(b.name);
            });
            setPokemons(detailedPokemons);

            setLoading(false);
        };

        getPokemons();
    }, [page, order]); // re-runs when the 'page' or 'order' state changes



    // Extract unique Pokémon types from the fetched Pokémon data
    useEffect(() => {
        const uniqueTypes = Array.from(
            new Set(
                pokemonsData.flatMap((pokemon: any) =>
                    pokemon.pokemon_v2_pokemontypes.map((type: any) => type.pokemon_v2_type)
                )
            )
        );
        setAllTypes(uniqueTypes); // Update the available types to filter by
    }, [pokemonsData]);// Runs every time the fetched Pokémon data changes

    // Filter Pokémon data by selected type, if any
    useEffect(() => {
        // First, filter based on the selected type
        let filteredData = selectedTypeId
            ? pokemonsData.filter((pokemon) =>
                pokemon.pokemon_v2_pokemontypes.some(
                    (type: { pokemon_v2_type: { id: number } }) => type.pokemon_v2_type.id === selectedTypeId
                )
            )
            : pokemonsData; // If no type is selected, use full list

        // Then, sort the filtered data based on the selected sort criteria
        filteredData = filteredData.map(extractPokemonDetails);
        filteredData.sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name); // Sort by name alphabetically
            } else {
                return b[sortBy] - a[sortBy]; // Sort by stat (higher values first)
            }
        });

        setPokemons(filteredData); // Apply transformation only to filtered and sorted results
    }, [selectedTypeId, sortBy]); // // Runs when the selected type or/and the sort criteria changes

    return (
        <section className="bg-gray-900 text-gray-200 py-10 px-12 min-h-screen">

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <img
                        src={pokemonBall}
                        alt="Loading Pokeball"
                        className="w-24 h-24 rounded-full animate-spin"
                    />
                </div>
            )}

            {/* TITLE */}
            <div className={`${loading ? 'blur-sm' : ''} transition-all duration-300`}>
                <div className="text-center">
                    <div className="text-7xl font-bold text-red-600 flex items-center justify-center space-x-2 group">
                        <span className="font-pokemon hover:cursor-pointer">P</span>
                        <img
                            src={pokemonBall}
                            alt="Pokeball"
                            className="mt-5 w-14 h-14 rounded-full object-cover transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110"
                        />
                        <span className="font-pokemon hover:cursor-pointer">KEMON</span>
                    </div>
                </div>
            </div>

            {/* Searching Block */}
            <span className="text-lg font-semibold text-white sm:mb-0 mb-4">Find your Pokemon</span>

            <div className="mt-2 flex flex-col sm:flex-row sm:space-x-4 sm:justify-between">

                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:w-full sm:items-center">

                    {/* Search by Name */}
                    <div className="flex flex-col mx-2 sm:w-1/4">
                        <span className="text-sm text-white mb-1">Search By Name</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Just updates the state, doesn't trigger search
                            placeholder="Search Pokémon by name"
                            className="px-4 py-1.5 border rounded mx-2 text-black h-10"
                        />
                    </div>

                    {/* Vertical Line Separator */}
                    <div className="hidden sm:block self-stretch border-l-2 border-gray-400 mx-4"></div>

                    {/* Stat Selection */}
                    <div className="flex flex-col mx-2 sm:w-1/4">
                        <span className="text-sm text-white mb-1">Criteria</span>
                        <select
                            value={selectedStat}
                            onChange={(e) => setSelectedStat(e.target.value as "hp" | "attack" | "defense")}
                            className="px-6 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        >
                            <option value="hp">HP</option>
                            <option value="attack">Attack</option>
                            <option value="defense">Defense</option>
                            <option value="speed">Speed</option>
                        </select>
                    </div>

                    {/* Minimum Stat Value */}
                    <div className="flex flex-col sm:w-1/4">
                        <span className="text-sm text-white mb-1">Min Value</span>
                        <input
                            type="number"
                            value={minStat}
                            onChange={(e) => setMinStat(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Min Value"
                            className="px-4 py-2 border rounded text-black"
                        />
                    </div>

                    {/* Maximum Stat Value */}
                    <div className="flex flex-col sm:w-1/4 mx-2">
                        <span className="text-sm text-white mb-1">Max Value</span>
                        <input
                            type="number"
                            value={maxStat}
                            onChange={(e) => setMaxStat(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Max Value"
                            className="px-4 py-2 border rounded text-black"
                        />
                    </div>

                </div>

                {/* Apply Search Button */}
                <div className="flex justify-center mt-6 sm:mt-0 sm:w-auto sm:ml-auto">
                    <button
                        onClick={handleSearch} // Only triggers search when clicked
                        className="mt-6 bg-blue-500 text-white px-6 py-1.5 rounded h-10"
                    >
                        Find
                    </button>
                </div>
            </div>


            {/* List Controls Container */}
            <div className="mt-12 flex justify-between items-center mb-0">

                {/* Left Side: Filter by Type and Sorting by Criteria */}
                <div className="flex space-x-4">
                    {/* Filter by Type */}

                    <div className="mb-4">
                        <label className="mr-2">Filter by type:</label>
                        <select
                            value={selectedTypeId || ''}
                            onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                            className="px-4 py-2 bg-gray-800 text-white rounded"
                        >
                            <option value="">All</option>
                            {allTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sorting by criteria */}
                    <div className="mb-4">
                        <label className="mr-2">Sort by:</label>
                        <select
                            className="px-4 py-2 bg-gray-800 text-white rounded"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "name" | "hp" | "attack" | "defense")}
                        >
                            <option value="name">Name</option>
                            <option value="hp">HP</option>
                            <option value="attack">Attack</option>
                            <option value="defense">Defense</option>
                        </select>
                    </div>
                </div>

                {/* Right Side: Ordering Control */}
                <div className="mb-4">
                    <label className="mr-2">Order:</label>
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded"
                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    >
                        {order === "asc" ? "Ascending 🔼" : "Descending 🔽"}
                    </button>
                </div>

            </div>

            {/* Pockemon Cards*/}
            <div className="grid gap-8 text-neutral-600 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {pokemons.map((pokemon) => {
                    return (
                        <PokemonCard
                            key={pokemon.name}
                            name={pokemon.name}
                            hp={pokemon.hp}
                            types={pokemon.types}
                            height={pokemon.height}
                            weight={pokemon.weight}
                            description={pokemon.description}
                            attack={pokemon.attack}
                            defense={pokemon.defense}
                            specialAttackDescription={pokemon.specialAttackDescription}
                            headerColor={pokemon.color} // Pass dynamic header color
                        />
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center space-x-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-lg">Page {page}</span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default PokemonList;
