// File: TraitSelector.tsx

import React, { useState } from "react";

interface TraitOption {
  option_type: string;
  string?: string;
  desc?: string;
}

interface TraitGroup {
  choose: number;
  from: {
    option_set_type: string;
    options: TraitOption[];
  };
}

interface TraitSelectorProps {
  title: string;
  group?: TraitGroup;
  selected: string[];
  setSelected: (items: string[]) => void;
}

const TraitSelector: React.FC<TraitSelectorProps> = ({
  title,
  group,
  selected,
  setSelected,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!group || !group.from?.options || group.from.options.length === 0) return null;

  const toggleExpanded = () => setExpanded(!expanded);

  const handleSelect = (desc: string) => {
    const isSelected = selected.includes(desc);
    if (isSelected) {
      setSelected(selected.filter((d) => d !== desc));
    } else if (selected.length < group.choose) {
      setSelected([...selected, desc]);
    }
  };

  return (
    <div className="border border-(--color-border) rounded-lg overflow-hidden">
      <button
        onClick={toggleExpanded}
        className="w-full px-4 py-2 text-left text-sm font-semibold flex justify-between items-center bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors"
        style={{ color: 'var(--color-accent)' }}
      >
        <span>
          {title} (Choose {group.choose})
        </span>
        <span>{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="px-4 py-2 text-sm space-y-2">
          {group.from.options.map((opt, i) => {
            const desc = opt.string || opt.desc || "[Missing description]";
            const isSelected = selected.includes(desc);
            const disabled = !isSelected && selected.length >= group.choose;

            return (
              <div
                key={i}
                onClick={() => !disabled && handleSelect(desc)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "bg-(--color-accent-light) border-(--color-accent)"
                    : "bg-(--color-bg) border-(--color-border) hover:border-(--color-accent)"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={
                  isSelected
                    ? { color: 'var(--color-accent)' }
                    : { color: 'var(--color-text)' }
                }
              >
                {desc}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TraitSelector;
