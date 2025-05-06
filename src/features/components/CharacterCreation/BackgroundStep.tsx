import React, { useEffect, useState } from "react";
import LanguageSelector from "./BackgroundStep/LanguageSelector";
import TraitSelector from "./BackgroundStep/TraitSelector";

interface BackgroundStepProps {
  formData: {
    background: string;
    extraLanguages?: string[];
    selectedTraits?: {
      personality_traits?: string[];
      ideals?: string[];
      bonds?: string[];
      flaws?: string[];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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

  // Local trait state, synced to formData
  const selectedTraits = formData.selectedTraits || {
    personality_traits: [],
    ideals: [],
    bonds: [],
    flaws: [],
  };

  const updateTraits = (key: keyof typeof selectedTraits, values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedTraits: {
        ...prev.selectedTraits,
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
        extraLanguages: [],
        selectedTraits: {
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
  }, [formData.background]);

  return (
    <div className="space-y-6">
      {/* Background Dropdown */}
      <div>
        <label className="block text-sm font-medium text-yellow-300 mb-1">Select Background</label>
        <select
          value={formData.background}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              background: e.target.value,
              extraLanguages: [],
              selectedTraits: {
                personality_traits: [],
                ideals: [],
                bonds: [],
                flaws: [],
              },
            }))
          }
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">-- Choose Background --</option>
          {backgroundList.map((bg) => (
            <option key={bg.index} value={bg.index}>
              {bg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Feature Accordion */}
      {backgroundDetails?.feature?.desc?.length > 0 && (
        <div className="border border-gray-600 rounded">
          <button
            onClick={() => setExpandedFeature(!expandedFeature)}
            className="w-full px-4 py-2 text-left text-sm font-semibold text-yellow-300 flex justify-between items-center"
          >
            <span>{backgroundDetails.feature.name}</span>
            <span>{expandedFeature ? "▾" : "▸"}</span>
          </button>
          {expandedFeature && (
            <div className="px-4 py-2 text-sm text-gray-300 whitespace-pre-line">
              {backgroundDetails.feature.desc.join("\n\n")}
            </div>
          )}
        </div>
      )}

      {/* Trait Selectors */}
      <TraitSelector
        title="Personality Traits"
        group={backgroundDetails?.personality_traits}
        selected={selectedTraits.personality_traits || []}
        setSelected={(val) => updateTraits("personality_traits", val)}
      />
      <TraitSelector
        title="Ideals"
        group={backgroundDetails?.ideals}
        selected={selectedTraits.ideals || []}
        setSelected={(val) => updateTraits("ideals", val)}
      />
      <TraitSelector
        title="Bonds"
        group={backgroundDetails?.bonds}
        selected={selectedTraits.bonds || []}
        setSelected={(val) => updateTraits("bonds", val)}
      />
      <TraitSelector
        title="Flaws"
        group={backgroundDetails?.flaws}
        selected={selectedTraits.flaws || []}
        setSelected={(val) => updateTraits("flaws", val)}
      />

      {/* Language Selector */}
      {formData.background && (
        <LanguageSelector
          selectedLanguages={formData.extraLanguages || []}
          setSelectedLanguages={(langs) =>
            setFormData((prev) => ({ ...prev, extraLanguages: langs }))
          }
          max={2}
        />
      )}
    </div>
  );
};

export default BackgroundStep;
