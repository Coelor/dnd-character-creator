import React from "react";
import { saveCharacter } from "../utils/createCharacter";
import { updateCharacter } from "../utils/updateCharacter";
import { CharacterInput } from "../../types/character";

interface SaveCharacterButtonProps {
  formData: CharacterInput;
  editing?: boolean;
  onSaved?: () => void;
}

const SaveCharacterButton: React.FC<SaveCharacterButtonProps> = ({
  formData,
  editing = false,
  onSaved,
}) => {
  const handleSave = async () => {
    try {
      if (editing && formData.id) {
        await updateCharacter(formData.id, formData);
        alert("Character updated successfully!");
      } else {
        await saveCharacter(formData);
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