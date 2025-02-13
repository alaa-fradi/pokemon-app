
type PokemonCardProps = {
    name: string; // Pokémon name
    hp: number; // Pokémon hit points (HP)
    types: string[]; // List of Pokémon types
    height: number; // Pokémon height
    weight: number; // Pokémon weight
    description: string; // Pokémon description
    attack: number; // Pokémon attack stat
    defense: number; // Pokémon defense stat
    specialAttackDescription: string; // Description of special attack (not used here, but might be needed)
    headerColor: string; // Color for the header background
};

// Pokémon card component
const PokemonCard = ({ name, hp, types, height, weight, description, attack, defense, specialAttackDescription, headerColor }: PokemonCardProps) => {
    return (
        <div className="my-8 shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-shadow-gray-200 dark:bg-gray-800 duration-300 hover:-translate-y-1 relative outline outline-[2px] outline-white outline-offset-[-14px] rounded-lg">
            <a className="cursor-pointer">
                <figure className=" m-[5%]">
                    <figcaption className="w-full block ">

                        {/* Header with Name and HP stat */}
                        <div
                            className="flex justify-between items-center py-2 px-4 rounded-t"
                            style={{
                                backgroundColor: headerColor, // Set background color dynamically
                                background: `linear-gradient(to bottom, ${headerColor},transparent)`,
                                opacity: 0.8,
                                height: '70px'
                            }}
                        >
                            <p className="text-white font-bold text-lg text-[1.5rem]">{name}</p>  {/* Pokémon Name */}
                            <p className="text-white font-bold text-lg">{hp} HP</p>    {/* Pokémon HP */}
                        </div>

                        {/* Display Pokémon types */}
                        <div className="flex justify-center gap-4 mt-2">
                            {types.map((type, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-center"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>

                        {/* Display Pokémon height and weight */}
                        <div className="flex justify-center gap-8 mt-4">
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>height:</strong> {height}
                            </div>
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>weight:</strong> {weight}
                            </div>
                        </div>

                        {/* Pokémon description section */}
                        <div className="mt-4 bg-gray-200 p-2 rounded-lg text-black m-[5%]">
                            <p>{description}</p>
                        </div>

                        {/* Display Pokémon attack and defense stats */}
                        <div className="flex justify-center gap-8 mt-4">
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>attack:</strong> {attack}
                            </div>
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>defense:</strong> {defense}
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </a>
        </div>
    );
};

export default PokemonCard;
