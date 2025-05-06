import React from "react";
import { CharacterStepProps } from "../../../../types/character";
import { CharacterInput } from "../../../../types/character";

const LevelSelector: React.FC<CharacterStepProps> = ({ formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium text-yellow-300 mb-1">Character Level</label>
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
      className="w-24 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
    />
  </div>
);

export default LevelSelector;
