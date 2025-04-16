import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Character } from "../types/character";
import {
    fetchCharacters,
    createCharacter,
    deleteCharacter,
} from "../slices/characterSlice";
import CharacterForm from "../components/CharacterForm";

export default function CharacterPage() {
    const dispatch = useAppDispatch();
    const characters = useAppSelector((state) => state.characters.characters);
    const loading = useAppSelector((state) => state.characters.loading);

    useEffect(() => {
        dispatch(fetchCharacters());
    }, [dispatch]);

    return (
        <main>
            <h1>Your Characters</h1>
            <CharacterForm onSubmit={(c: Partial<Character>) => dispatch(createCharacter(c))} />
            {loading && <p>Loading...</p>}
            <ul>
                {characters.map((char) => (
                    <li key={char.id}>
                        <strong>{char.name}</strong> – {char.race} {char.class}
                        <button onClick={() => dispatch(deleteCharacter(char.id))}>🗑</button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
