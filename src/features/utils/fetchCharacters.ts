import { client } from "../../../amplify/data/client";
import { getCurrentUser } from "aws-amplify/auth";

export const fetchCharacters = async () => {
  const { username } = await getCurrentUser();

  const result = await client.models.Character.list({
    filter: {
      owner: { eq: username }
    }
  });

  return result.data;
};
