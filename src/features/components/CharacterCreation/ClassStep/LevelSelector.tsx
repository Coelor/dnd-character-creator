import React from "react";
import { CharacterStepProps } from "../../../../types/character";
import { CharacterInput } from "../../../../types/character";

const LevelSelector: React.FC<CharacterStepProps> = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      Character Level
    </label>
    <input
      type="number"
      min={1}
      max={20}
      value={formData.level}
      onChange={(e) =>
        setFormData((prev: CharacterInput) => ({
          ...prev,
          level: Number(e.target.value),
        }))
      }
      className="input-field w-24"
    />
    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
      Level 1-20
    </p>
  </div>
);

export default LevelSelector;
