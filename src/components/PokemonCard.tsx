import React from "react";

type PokemonCardProps = {
    name: string;
    hp: number;
    types: string[]; // Accept types as an array
    height: number;
    weight: number;
    description: string;
    attack: number;
    defense: number;
    specialAttackDescription: string;
    headerColor: string;
};

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
                                backgroundColor: headerColor,
                                background: `linear-gradient(to bottom, ${headerColor},transparent)`,
                                opacity: 0.8,
                                height: '70px'
                            }}
                        >
                            <p className="text-white font-bold text-lg text-[1.5rem]">{name}</p>  {/* Pokémon Name */}
                            <p className="text-white font-bold text-lg">{hp} HP</p>    {/* Pokémon HP */}
                        </div>
                        {/* types */}
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
                        {/* Length and Height  */}
                        <div className="flex justify-center gap-8 mt-4">
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>height:</strong> {height}
                            </div>
                            <div className="bg-gray-300 text-black px-4 py-2 rounded-full text-center">
                                <strong>weight:</strong> {weight}
                            </div>
                        </div>

                        {/* Description  */}
                        <div className="mt-4 bg-gray-200 p-2 rounded-lg text-black m-[5%]">
                            <p>{description}</p>
                        </div>

                        {/* Attack and Defense  */}
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
