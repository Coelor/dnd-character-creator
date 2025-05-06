import { client } from "../../../amplify/data/client";
import { getCurrentUser } from "aws-amplify/auth";

export const saveCharacter = async (characterData: any) => {
  try {
    const { username } = await getCurrentUser();

    // Ensure required fields and assign ownership
    const result = await client.models.Character.create({
      ...characterData,
      owner: username
    });

    return result.data;
  } catch (error) {
    console.error("Failed to save character:", error);
    throw error;
  }
};
