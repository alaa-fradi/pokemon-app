import { useEffect, useState } from "react";
import { fetchPokemons, fetchPokemonsTypes } from "../services/PokemonService";
import PokemonCard from "./PokemonCard";
import pokemonBall from "../assets/pokemonBall.jpg";
// Define the structure of the types
interface PokemonType {
    id: number;
    name: string;
}
const PokemonList = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [pokemonsData, setPokemonsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 16; // Number of Pokémon per page
    const [order, setOrder] = useState<"asc" | "desc">("asc"); // Default to ascending order
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [allTypes, setAllTypes] = useState<PokemonType[]>([]); // Use PokemonType interface
    const [sortBy, setSortBy] = useState<"name" | "hp" | "attack" | "defense">("name");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStat, setSelectedStat] = useState<"hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed">("hp");
    const [minStat, setMinStat] = useState<number | "">("");
    const [searchInput, setSearchInput] = useState(""); // Holds the input value
    const [filteredPokemons, setFilteredPokemons] = useState<any[]>(pokemons);
    const [maxStat, setMaxStat] = useState<number | "">("");


    const getStat = (pokemonData: any, statName: string) => {
        const stat = pokemonData.pokemon_v2_pokemonstats.find((s: any) => s.pokemon_v2_stat.name === statName);
        return stat ? stat.base_stat : null;
    };

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

    const handleSearch = async () => {
        setLoading(true);

        // Fetch the filtered Pokémon data based on searchQuery, minStat, and maxStat
        const offset = (page - 1) * limit;

        const pokemonsData = await fetchPokemons(order, limit, offset, searchQuery, selectedStat, minStat, maxStat);

        // Process the data as needed
        const detailedPokemons = pokemonsData.map((pokemon: any) => extractPokemonDetails(pokemon));

        setPokemons(detailedPokemons);
        setLoading(false);
    };

    useEffect(() => {
        const getPokemons = async () => {
            setLoading(true);
            const offset = (page - 1) * limit;
            const pokemonsData = await fetchPokemons(order, limit, offset, searchQuery, selectedStat, minStat, maxStat);
            setPokemonsData(pokemonsData);

            const detailedPokemons = pokemonsData.map((pokemon: any) => extractPokemonDetails(pokemon));
            setPokemons(detailedPokemons);

            setLoading(false);
        };

        getPokemons();
    }, [page, order]); // Include all relevant dependencies



    // Extract unique types from pokemonsData
    useEffect(() => {
        const uniqueTypes = Array.from(
            new Set(
                pokemonsData.flatMap((pokemon: any) =>
                    pokemon.pokemon_v2_pokemontypes.map((type: any) => type.pokemon_v2_type)
                )
            )
        );
        setAllTypes(uniqueTypes); // Update the available types
    }, [pokemonsData]);

    useEffect(() => {
        const filteredData = selectedTypeId
            ? pokemonsData.filter((pokemon) =>
                pokemon.pokemon_v2_pokemontypes.some(
                    (type: { pokemon_v2_type: { id: number } }) => type.pokemon_v2_type.id === selectedTypeId
                )
            )
            : pokemonsData; // If no type is selected, use full list

        setPokemons(filteredData.map(extractPokemonDetails)); // Apply transformation only to filtered results
    }, [selectedTypeId, pokemonsData]); // Runs when type selection or data changes

    useEffect(() => {
        if (pokemons.length === 0) return; // Prevent sorting empty list

        let sortedPokemons = [...pokemons];

        sortedPokemons.sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else {
                return b[sortBy] - a[sortBy]; // Sort by stat (higher values first)
            }
        });

        setPokemons(sortedPokemons);
    }, [sortBy]);

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
                            onChange={(e) => setSelectedStat(e.target.value as "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed")}
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
