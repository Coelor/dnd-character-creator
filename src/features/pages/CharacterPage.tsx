import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCharacters, deleteCharacter } from "../slices/characterSlice";
import { Link } from "react-router-dom";

export default function CharacterPage() {
    const dispatch = useAppDispatch();
    const characters = useAppSelector((state) => state.characters.characters);
    const loading = useAppSelector((state) => state.characters.loading);

    useEffect(() => {
        dispatch(fetchCharacters());
    }, [dispatch]);

    return (
        <section className="w-full max-w-4xl mx-auto mt-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-[#3a2e1f]">My Characters</h2>
                <Link
                    to="/create"
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    + Create Character
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : characters.length === 0 ? (
                <p className="text-gray-600 italic">List empty</p>
            ) : (
                <ul className="space-y-3">
                    {characters.map((char) => (
                        <li
                            key={char.id}
                            className="bg-[#fdf6e3] border border-[#b49a76] p-4 rounded-xl shadow-sm flex justify-between items-center"
                        >
                            <div className="text-[#3a2e1f]">
                                <strong className="text-lg font-bold">{char.name}</strong> —{" "}
                                <span>{char.race} {char.class}</span>
                            </div>
                            <button
                                onClick={() => dispatch(deleteCharacter(char.id))}
                                className="text-red-600 hover:text-red-800"
                            >
                                🗑
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
