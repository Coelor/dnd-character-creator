import React from "react";

interface Subrace {
  index: string;
  name: string;
  url: string;
}

interface SubraceSelectorProps {
  subraces: Subrace[];
  value: string;
  onChange: (value: string) => void;
}

const SubraceSelector: React.FC<SubraceSelectorProps> = ({ subraces, value, onChange }) => {
  if (subraces.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-yellow-300 mb-1">Select Subrace</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="">-- Choose Subrace --</option>
        {subraces.map((subrace) => (
          <option key={subrace.index} value={subrace.index}>
            {subrace.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubraceSelector;
