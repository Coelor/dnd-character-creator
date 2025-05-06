import React from "react";

interface ProficiencyPickerProps {
  proficiencyChoices: {
    desc: string;
    choose: number;
    options: { name: string; index: string }[];
  };
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProficiencyPicker: React.FC<ProficiencyPickerProps> = ({ proficiencyChoices, selected, setSelected }) => (
  <div className="space-y-2">
    <p className="text-sm text-yellow-300">{proficiencyChoices.desc}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {proficiencyChoices.options.map((opt) => {
        const isSelected = selected.includes(opt.index);
        const disabled = !isSelected && selected.length >= proficiencyChoices.choose;

        return (
          <label
            key={opt.index}
            className={`flex items-center space-x-2 px-3 py-2 rounded border 
              ${isSelected ? "bg-purple-600 border-yellow-300 text-yellow-100" : "bg-gray-800 border-gray-600 text-white"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              disabled={disabled}
              onChange={() => {
                setSelected((prev) =>
                  isSelected ? prev.filter((p) => p !== opt.index) : [...prev, opt.index]
                );
              }}
            />
            <span>{opt.name}</span>
          </label>
        );
      })}
    </div>
  </div>
);

export default ProficiencyPicker;