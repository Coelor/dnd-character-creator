import { client } from "../../../amplify/data/client";
import { getCurrentUser } from "aws-amplify/auth";
import { CharacterInput } from "../../types/character";

export const saveCharacter = async (characterData: CharacterInput) => {
  try {
    const { username } = await getCurrentUser();

    // Remove 'id' if it's null to avoid type error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = characterData;
    const result = await client.models.Character.create({
      ...rest,
      owner: username,
    });

    return result.data;
  } catch (error) {
    console.error("Failed to save character:", error);
    throw error;
  }
};

