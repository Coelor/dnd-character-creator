import React, { useState } from "react";

interface Trait {
  name: string;
  url: string;
  index?: string;
}

interface TraitDetails {
  name: string;
  desc: string[];
}

interface TraitAccordionProps {
  traits: Trait[];
}

const TraitAccordion: React.FC<TraitAccordionProps> = ({ traits }) => {
  const [expandedTrait, setExpandedTrait] = useState<string | null>(null);
  const [traitDescriptions, setTraitDescriptions] = useState<Record<string, string>>({});

  const handleToggle = async (trait: Trait) => {
    const index = trait.index || trait.url.split("/").pop()!;
    const isOpen = expandedTrait === index;

    if (isOpen) {
      setExpandedTrait(null);
      return;
    }

    setExpandedTrait(index);

    if (!traitDescriptions[index]) {
      try {
        const res = await fetch(`https://www.dnd5eapi.co${trait.url}`);
        const data: TraitDetails = await res.json();
        const description = data.desc?.join("\n\n") || "No description available.";
        setTraitDescriptions((prev) => ({ ...prev, [index]: description }));
      } catch {
        setTraitDescriptions((prev) => ({ ...prev, [index]: "Failed to load description." }));
      }
    }
  };

  return (
    <div className="space-y-2">
      {traits.map((trait) => {
        const index = trait.index || trait.url.split("/").pop()!;
        const isExpanded = expandedTrait === index;

        return (
          <div key={index} className="border border-(--color-border) rounded-lg overflow-hidden">
            <button
              onClick={() => handleToggle(trait)}
              className="w-full text-left px-4 py-2 font-semibold flex justify-between items-center bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              <span>{trait.name}</span>
              <span>{isExpanded ? "▾" : "▸"}</span>
            </button>
            {isExpanded && (
              <div className="px-4 py-2 text-sm whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
                {traitDescriptions[index] || "Loading..."}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TraitAccordion;