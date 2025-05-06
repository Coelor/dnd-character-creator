import React, { useEffect, useState } from "react";
// import StatsSection from "./DashboardPage/StatsSection";
import CharactersSection, { Character } from "./DashboardPage/CharactersSection";
import { fetchCharacters } from "../utils/fetchCharacters";
import { RawCharacter } from "../../types/character";

const DashboardPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data: RawCharacter[] = await fetchCharacters();
  
        const mapped: Character[] = data.map((char) => ({
          name: char.name ?? "Unknown",
          hp: char.hp ?? "0/0",
          ac: char.ac ?? 10,
          init: char.init ?? 0,
          level: char.level ?? 1,
          img: char.img ?? "/default-avatar.png",
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
