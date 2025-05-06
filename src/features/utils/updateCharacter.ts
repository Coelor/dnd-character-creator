import { client } from "../../../amplify/data/client";

export const updateCharacter = async (id: string, updatedData: Partial<Parameters<typeof client.models.Character.update>[0]>) => {
  const result = await client.models.Character.update({
    id,
    ...updatedData,
  });
  return result.data;
};
