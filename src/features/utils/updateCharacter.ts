import { supabase } from "../../lib/supabase";

export const updateCharacter = async (id: string, updatedData: any) => {
  const { data, error } = await supabase
    .from('characters')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
