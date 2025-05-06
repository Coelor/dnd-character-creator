import React from "react";
import { client } from "../../../amplify/data/client";
import { CharacterInput } from "../../types/character";

interface SaveCharacterButtonProps {
  formData: CharacterInput;
  editing?: boolean;
  onSaved?: () => void;
}

const stringifyJson = (value: unknown) =>
  typeof value === "undefined" ? null : JSON.stringify(value);

const SaveCharacterButton: React.FC<SaveCharacterButtonProps> = ({
  formData,
  editing = false,
  onSaved,
}) => {
  const handleSave = async () => {
    try {
      // Remove `id` for create, or separate it for update
      const { id, ...payload } = formData;

      // Build one “clean” object where every JSON field is stringified
      const clean: Record<string, unknown> = {
        ...payload,
        baseAbilities: stringifyJson(payload.baseAbilities),
        raceBonuses: stringifyJson(payload.raceBonuses),
        classAbilityBonuses: stringifyJson(payload.classAbilityBonuses),
        extraLanguages: stringifyJson(payload.extraLanguages),
        selectedTraits: stringifyJson(payload.selectedTraits),
        proficiencies: stringifyJson(payload.proficiencies),
      };

      if (editing && id) {
        await client.models.Character.update({ id, ...clean });
        alert("Character updated successfully!");
      } else {
        await client.models.Character.create(clean);
        alert("Character saved successfully!");
      }

      onSaved?.();
    } catch (err) {
      console.error("Error saving character:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      className="px-4 py-2 mt-6 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      onClick={handleSave}
    >
      {editing ? "Update Character" : "Save Character"}
    </button>
  );
};

export default SaveCharacterButton;