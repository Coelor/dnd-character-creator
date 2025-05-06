import React from "react";
import { CharacterStepProps } from "../../../../types/character";

interface ClassSelectorProps extends CharacterStepProps {
  classList: string[];
  resetProficiencies: () => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ formData, setFormData, classList, resetProficiencies }) => (
  <div className="flex-1 min-w-[200px]">
    <label className="block text-sm font-medium text-yellow-300 mb-1">Select Class</label>
    <select
      value={formData.class}
      onChange={(e) => {
        setFormData((prev) => ({ ...prev, class: e.target.value }));
        resetProficiencies();
      }}
      className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
    >
      <option value="">-- Choose Class --</option>
      {classList.map((cls) => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </select>
  </div>
);

export default ClassSelector;