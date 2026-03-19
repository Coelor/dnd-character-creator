import React, { useState } from "react";

interface Trait {
  name: string;
  description: string;
}

interface TraitAccordionProps {
  traits: Trait[];
}

const TraitAccordion: React.FC<TraitAccordionProps> = ({ traits }) => {
  const [expandedTrait, setExpandedTrait] = useState<string | null>(null);

  const handleToggle = (index: string) => {
    const isOpen = expandedTrait === index;
    setExpandedTrait(isOpen ? null : index);
  };

  return (
    <div className="space-y-2">
      {traits.map((trait, idx) => {
        const index = `${trait.name}-${idx}`;
        const isExpanded = expandedTrait === index;

        return (
          <div key={index} className="border border-(--color-border) rounded-lg overflow-hidden">
            <button
              onClick={() => handleToggle(index)}
              className="w-full text-left px-4 py-2 font-semibold flex justify-between items-center bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              <span>{trait.name}</span>
              <span>{isExpanded ? "▾" : "▸"}</span>
            </button>
            {isExpanded && (
              <div className="px-4 py-2 text-sm whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
                {trait.description || "No description available."}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TraitAccordion;