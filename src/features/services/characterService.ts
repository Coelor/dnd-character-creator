import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const CharacterAPI = {
    list: async () => {
        const { data } = await client.models.Character.list();
        return data;
    },

    create: async (character: Partial<Schema["Character"]["type"]>) => {
        return await client.models.Character.create(character);
    },

    delete: async (id: string) => {
        return await client.models.Character.delete({ id });
    },
};
