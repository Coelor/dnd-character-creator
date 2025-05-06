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
      name: c.name ?? undefined,
      race: c.race ?? undefined,
      class: c.class ?? undefined,
      background: c.background ?? undefined,
      alignment: c.alignment ?? undefined,
      level: c.level ?? undefined,
      hp: c.hp ?? undefined,
      ac: c.ac ?? undefined,
      init: c.init ?? undefined,
      img: c.img ?? undefined,
      owner: c.owner ?? undefined,
      updatedAt: c.updatedAt ?? new Date().toISOString(),
      proficiencies: c.proficiencies ?? [],
      baseAbilities: c.baseAbilities ?? {},
      raceBonuses: c.raceBonuses ?? {},
      classAbilityBonuses: c.classAbilityBonuses ?? [],
      selectedTraits:
        c.selectedTraits ??
        {
          personality_traits: [],
          ideals: [],
          bonds: [],
          flaws: [],
        },
    };
  });
};
