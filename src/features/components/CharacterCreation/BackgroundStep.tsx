import React, { useEffect, useState } from "react";
import LanguageSelector from "./BackgroundStep/LanguageSelector";
import TraitSelector from "./BackgroundStep/TraitSelector";
import { CharacterInput } from "../../../types/character";

interface BackgroundStepProps {
  formData: CharacterInput;
  setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
}

interface BackgroundSummary {
  index: string;
  name: string;
  url: string;
}

interface Feature {
  name: string;
  desc: string[];
}

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

interface BackgroundDetails {
  name: string;
  feature?: Feature;
  personality_traits?: TraitGroup;
  ideals?: TraitGroup;
  bonds?: TraitGroup;
  flaws?: TraitGroup;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({ formData, setFormData }) => {
  const [backgroundList, setBackgroundList] = useState<BackgroundSummary[]>([]);
  const [backgroundDetails, setBackgroundDetails] = useState<BackgroundDetails | null>(null);
  const [expandedFeature, setExpandedFeature] = useState(false);

  const selected_traits = formData.selected_traits ?? {
    personality_traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
  };

  const updateTraits = (
    key: "personality_traits" | "ideals" | "bonds" | "flaws",
    values: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      selected_traits: {
        personality_traits: prev.selected_traits?.personality_traits || [],
        ideals: prev.selected_traits?.ideals || [],
        bonds: prev.selected_traits?.bonds || [],
        flaws: prev.selected_traits?.flaws || [],
        [key]: values,
      },
    }));
  };
  
  

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/backgrounds")
      .then((res) => res.json())
      .then((data) => setBackgroundList(data.results));
  }, []);

  useEffect(() => {
    if (!formData.background) {
      setBackgroundDetails(null);
      setFormData((prev) => ({
        ...prev,
        extra_languages: [],
        selected_traits: {
          personality_traits: [],
          ideals: [],
          bonds: [],
          flaws: [],
        },
      }));
      return;
    }

    fetch(`https://www.dnd5eapi.co/api/backgrounds/${formData.background}`)
      .then((res) => res.json())
      .then((data) => setBackgroundDetails(data));
  }, [formData.background, setFormData]);

  return (
    <div className="space-y-6">
      {/* Background Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Select Background
        </label>
        <select
          value={formData.background ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              background: e.target.value,
              extra_languages: [],
              selected_traits: {
                personality_traits: [],
                ideals: [],
                bonds: [],
                flaws: [],
              },
            }))
          }
          className="input-field"
        >
          <option value="">-- Choose Background --</option>
          {backgroundList.map((bg) => (
            <option key={bg.index} value={bg.index}>
              {bg.name}
            </option>
          ))}
        </select>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your background provides proficiencies, languages, and personality traits
        </p>
      </div>

      {/* Feature Accordion */}
      {backgroundDetails?.feature?.desc && backgroundDetails.feature.desc.length > 0 && (
        <div className="border border-(--color-border) rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedFeature(!expandedFeature)}
            className="w-full px-4 py-3 text-left font-semibold flex justify-between items-center bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            <span>{backgroundDetails.feature.name}</span>
            <span>{expandedFeature ? "▾" : "▸"}</span>
          </button>
          {expandedFeature && (
            <div className="px-4 py-3 text-sm whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
              {backgroundDetails.feature.desc.join("\n\n")}
            </div>
          )}
        </div>
      )}

      {/* Trait Selectors */}
      <TraitSelector
        title="Personality Traits"
        group={backgroundDetails?.personality_traits}
        selected={selected_traits.personality_traits}
        setSelected={(val) => updateTraits("personality_traits", val)}
      />
      <TraitSelector
        title="Ideals"
        group={backgroundDetails?.ideals}
        selected={selected_traits.ideals}
        setSelected={(val) => updateTraits("ideals", val)}
      />
      <TraitSelector
        title="Bonds"
        group={backgroundDetails?.bonds}
        selected={selected_traits.bonds}
        setSelected={(val) => updateTraits("bonds", val)}
      />
      <TraitSelector
        title="Flaws"
        group={backgroundDetails?.flaws}
        selected={selected_traits.flaws}
        setSelected={(val) => updateTraits("flaws", val)}
      />

      {/* Language Selector */}
      {formData.background && (
        <LanguageSelector
          selectedLanguages={formData.extra_languages || []}
          setSelectedLanguages={(langs) =>
            setFormData((prev) => ({ ...prev, extra_languages: langs }))
          }
          max={2}
        />
      )}
    </div>
  );
};

export default BackgroundStep;
