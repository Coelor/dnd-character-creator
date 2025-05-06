import { client } from "../../../amplify/data/client";
import { getCurrentUser } from "aws-amplify/auth";
import { CharacterInput } from "../../types/character";

export const saveCharacter = async (characterData: CharacterInput) => {
  try {
    const { username } = await getCurrentUser();

    const result = await client.models.Character.create({
      ...characterData,
      owner: username,
    });

    return result.data;
  } catch (error) {
    console.error("Failed to save character:", error);
    throw error;
  }
};
