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
    <div className="border border-gray-600 rounded">
      <button
        onClick={toggleExpanded}
        className="w-full px-4 py-2 text-left text-sm font-semibold text-yellow-300 flex justify-between items-center"
      >
        <span>
          {title} (Choose {group.choose})
        </span>
        <span>{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="px-4 py-2 text-sm text-gray-300 space-y-2">
          {group.from.options.map((opt, i) => {
            const desc = opt.string || opt.desc || "[Missing description]";
            const isSelected = selected.includes(desc);

            return (
              <div
                key={i}
                onClick={() => handleSelect(desc)}
                className={`cursor-pointer p-2 rounded border ${
                  isSelected
                    ? "bg-yellow-300 text-black border-yellow-400"
                    : "bg-gray-700 text-white border-gray-600"
                }`}
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
