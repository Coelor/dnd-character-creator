import React, { useEffect, useState } from "react";
import StatsSection from "./DashboardPage/StatsSection";
import CharactersSection, { Character } from "./DashboardPage/CharactersSection";
import { fetchCharacters } from "../utils/fetchCharacters";

const DashboardPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        const mapped: Character[] = data.map((char: any) => ({
          name: char.name,
          hp: char.hp || "0/0", // fallback if missing
          ac: char.ac || 10,
          init: char.init || 0,
          level: char.level || 1,
          img: char.img || "/default-avatar.png", // fallback avatar
        }));
        setCharacters(mapped);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    loadCharacters();
  }, []);

  return (
    <div className="space-y-12">
      {/* <StatsSection stats={stats} /> */}
      <CharactersSection characters={characters} />
      {/* <CampaignsSection campaigns={campaigns} /> */}
      {/* <ActivitySection recent={recent} /> */}
    </div>
  );
};

export default DashboardPage;
