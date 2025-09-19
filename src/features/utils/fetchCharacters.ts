import { supabase } from "../../lib/supabase";
import { RawCharacter } from "../../types/character";

export const fetchCharacters = async (): Promise<RawCharacter[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log("Logged in user:", user.id);

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((char) => {
    return {
      id: char.id,
      name: char.name ?? "Unknown",
      race: char.race ?? "Unknown",
      class: char.class ?? "Unknown",
      background: char.background ?? "None",
      alignment: char.alignment ?? "Neutral",
      level: char.level ?? 1,
      experience_points: char.experience_points ?? 0,
      hp: char.hp ?? "0/0",
      ac: char.ac ?? 10,
      init: char.init ?? 0,
      img: char.img ?? "/default-avatar.png",
      owner: char.user_id ?? "unknown",
      updated_at: char.updated_at ?? new Date().toISOString(),
      created_at: char.created_at ?? new Date().toISOString(),
      proficiencies: char.proficiencies ?? [],
      base_abilities: char.base_abilities ?? {},
      race_bonuses: char.race_bonuses ?? {},
      class_ability_bonuses: char.class_ability_bonuses ?? [],
      selected_traits: char.selected_traits ?? {
        personality_traits: [],
        ideals: [],
        bonds: [],
        flaws: [],
      },
      subrace: char.subrace,
      subclass: char.subclass,
      extra_languages: char.extra_languages ?? [],
      user_id: char.user_id,
    };
  });
};
