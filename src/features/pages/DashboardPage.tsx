import React, { useEffect, useState } from "react";
// import StatsSection from "./DashboardPage/StatsSection";
import CharactersSection, { Character } from "./DashboardPage/CharactersSection";
import { fetchCharacters } from "../utils/fetchCharacters";
import { RawCharacter } from "../../types/character";

const DashboardPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data: RawCharacter[] = await fetchCharacters();

        // map the AppSync → UI shape
        const uiChars: Character[] = data.map((char) => ({
          name: char.name ?? "Unknown",
          hp: char.hp ?? "0/0",
          ac: char.ac ?? 10,
          init: char.init ?? 0,
          level: char.level ?? 1,
          img: char.img ?? "/default-avatar.png",
        }));

        setCharacters(uiChars);
      } catch (e) {
        console.error("Failed to fetch characters:", e);
        setError("Could not load your characters.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading your characters…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-12">
      <CharactersSection characters={characters} />
    </div>
  );
};

export default DashboardPage;
