import { useState } from "react";
import { Save } from 'lucide-react';
import { Button } from "../../components/ui/Button";
import { saveCharacter } from "../utils/createCharacter";
import { updateCharacter } from "../utils/updateCharacter";
import type { CharacterInput } from "../../types/character";

interface SaveCharacterButtonProps {
  formData: CharacterInput;
  editing?: boolean;
  onSaved?: () => void;
}

const SaveCharacterButton = ({
  formData,
  editing = false,
  onSaved,
}: SaveCharacterButtonProps) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      if (editing && formData.id) {
        await updateCharacter(formData.id, formData);
      } else {
        await saveCharacter(formData);
      }
      onSaved?.();
    } catch (err) {
      console.error("Error saving character:", err);
      setError("Failed to save character. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSave}
        disabled={saving}
        variant="primary"
      >
        <Save size={18} className="mr-2" />
        {saving ? "Saving..." : editing ? "Update Character" : "Save Character"}
      </Button>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default SaveCharacterButton;