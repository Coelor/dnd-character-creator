import { supabase } from "../../lib/supabase";
import { CharacterInput } from "../../types/character";

export const saveCharacter = async (characterData: CharacterInput) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log("Created with logged in user:", user.id);

    // Remove 'id' if it's null to avoid type error
    const { id: _id, ...rest } = characterData;

    const { data, error } = await supabase
      .from('characters')
      .insert({
        ...rest,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to save character:", error);
    throw error;
  }
};

