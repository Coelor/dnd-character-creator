import { client } from "../../../amplify/data/client";
import { getCurrentUser } from "aws-amplify/auth";
import { RawCharacter } from "../../types/character";

export const fetchCharacters = async (): Promise<RawCharacter[]> => {
  const { username } = await getCurrentUser();

  const result = await client.models.Character.list({
    filter: {
      owner: { eq: username },
    },
  });

  return (result.data ?? []).map((char) => {
    const c = char as Partial<RawCharacter>;

    return {
      name: c.name ?? "Unknown",
      race: c.race ?? "Unknown",
      class: c.class ?? "Unknown",
      background: c.background ?? "None",
      alignment: c.alignment ?? "Neutral",
      level: c.level ?? 1,
      hp: c.hp ?? "0/0",
      ac: c.ac ?? 10,
      init: c.init ?? 0,
      img: c.img ?? "/default-avatar.png",
      owner: c.owner ?? "unknown",
      updatedAt: c.updatedAt ?? new Date().toISOString(),
      proficiencies: c.proficiencies ?? [],
      baseAbilities: c.baseAbilities ?? {},
      raceBonuses: c.raceBonuses ?? {},
      classAbilityBonuses: c.classAbilityBonuses ?? [],
      selectedTraits: c.selectedTraits ?? {
        personality_traits: [],
        ideals: [],
        bonds: [],
        flaws: [],
      },
    };
    
  });
};
