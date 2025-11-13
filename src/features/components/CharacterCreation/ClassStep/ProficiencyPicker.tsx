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
    <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      {proficiencyChoices.desc}
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {proficiencyChoices.options.map((opt) => {
        const isSelected = selected.includes(opt.index);
        const disabled = !isSelected && selected.length >= proficiencyChoices.choose;

        return (
          <label
            key={opt.index}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all
              ${isSelected
                ? "bg-(--color-accent) border-(--color-accent) text-white"
                : "bg-(--color-bg) border-(--color-border) hover:border-(--color-accent)"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            style={
              !isSelected && !disabled
                ? { color: 'var(--color-text)' }
                : undefined
            }
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
              className="accent-[var(--color-accent)]"
            />
            <span className="text-sm">{opt.name}</span>
          </label>
        );
      })}
    </div>
  </div>
);

export default ProficiencyPicker;