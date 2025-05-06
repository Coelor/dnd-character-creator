import React from "react";
import { CharacterInput } from "../../../types/character";
import { CharacterStepProps } from "../../../types/character";

const alignments = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

const BasicsStep: React.FC<CharacterStepProps> = ({ formData, setFormData }) => {
  const handleAlignmentSelect = (alignment: string) => {
    setFormData((prev: CharacterInput) => ({ ...prev, alignment }));
  };

  return (
    <div className="space-y-6">
      {/* Character Name Input */}
      <div>
        <label className="block text-sm font-medium text-yellow-300 mb-1">Character Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev: CharacterInput) => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter name..."
        />
      </div>

      {/* Alignment Grid */}
      <div>
        <label className="block text-sm font-medium text-yellow-300 mb-2">Alignment</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {alignments.map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => handleAlignmentSelect(alignment)}
              className={`px-3 py-2 rounded-md text-sm font-medium border transition
                ${formData.alignment === alignment
                  ? "bg-purple-600 text-yellow-300 border-yellow-300"
                  : "bg-gray-700 text-white border-gray-600 hover:border-yellow-500"}`}
            >
              {alignment}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicsStep;
