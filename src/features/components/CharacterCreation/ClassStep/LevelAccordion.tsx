import React from "react";
import SubclassSelector from "./SubclassSelector";
import { CharacterInput } from "../../../../types/character";

interface Feature {
  name: string;
  url: string;
}

interface ClassLevel {
  level: number;
  features: Feature[];
}

interface LevelAccordionProps {
  levelData: ClassLevel[];
  featureDetails: Record<number, Record<string, string>>;
  formData: {
    level: number;
    class: string;
    subclass?: string;
  };
  expanded: number | null;
  handleToggle: (lvl: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
  subclassLevel: number | null;
}

const LevelAccordion: React.FC<LevelAccordionProps> = ({
  levelData,
  featureDetails,
  formData,
  expanded,
  handleToggle,
  setFormData,
  subclassLevel,
}) => {
  return (
    <div className="space-y-3">
      {levelData.slice(0, formData.level).map((lvl) => (
        <div key={lvl.level} className="rounded-lg border border-(--color-border) bg-(--color-surface)">
          <button
            className="w-full flex justify-between items-center px-4 py-2 text-left text-sm font-semibold hover:bg-(--color-surface-hover) transition-colors"
            style={{ color: 'var(--color-accent)' }}
            onClick={() => handleToggle(lvl.level)}
          >
            <span>Level {lvl.level}</span>
            <span>{expanded === lvl.level ? "▾" : "▸"}</span>
          </button>

          {expanded === lvl.level && (
            <div className="px-4 py-2 space-y-3 text-sm" style={{ color: 'var(--color-text)' }}>
              {lvl.features.length > 0 ? (
                lvl.features.map((f, i) => (
                  <div key={i} className="space-y-1">
                    <div className="font-semibold">• {f.name}</div>
                    <div className="whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
                      {featureDetails?.[lvl.level]?.[f.name] || "Loading..."}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-muted)' }}>No features listed</div>
              )}

              {subclassLevel !== null && subclassLevel === lvl.level && (
                <SubclassSelector
                  className={formData.class}
                  level={formData.level}
                  selected={formData.subclass || ""}
                  setSelected={(val) =>
                    setFormData((prev: CharacterInput) => ({
                      ...prev,
                      subclass: val,
                    }))
                  }
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LevelAccordion;
