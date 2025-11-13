import React from "react";
import { CharacterStepProps } from "../../../../types/character";

interface ClassSelectorProps extends CharacterStepProps {
  classList: string[];
  resetProficiencies: () => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ formData, setFormData, classList, resetProficiencies }) => (
  <div className="flex-1 min-w-[200px]">
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      Select Class
    </label>
    <select
      value={formData.class}
      onChange={(e) => {
        setFormData((prev) => ({ ...prev, class: e.target.value }));
        resetProficiencies();
      }}
      className="input-field"
    >
      <option value="">-- Choose Class --</option>
      {classList.map((cls) => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </select>
    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
      Your class determines abilities, proficiencies, and playstyle
    </p>
  </div>
);

export default ClassSelector;