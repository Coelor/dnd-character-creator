import React, { useEffect, useState } from "react";

interface RaceStepProps {
  formData: {
    race: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

interface RaceSummary {
  index: string;
  name: string;
  url: string;
}

interface AbilityBonus {
  ability_score: {
    index: string;
    name: string;
  };
  bonus: number;
}

interface Trait {
  name: string;
  url: string;
}

interface TraitDetails {
  name: string;
  desc: string[];
}

interface RaceDetails {
  name: string;
  ability_bonuses: AbilityBonus[];
  desc?: string[];
  traits: Trait[];
}

const RaceStep: React.FC<RaceStepProps> = ({ formData, setFormData }) => {
  const [raceList, setRaceList] = useState<RaceSummary[]>([]);
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [expandedTrait, setExpandedTrait] = useState<string | null>(null);
  const [traitDescriptions, setTraitDescriptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Fetch race list on mount
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races")
      .then((res) => res.json())
      .then((data) => setRaceList(data.results));
  }, []);

  // Fetch selected race details
  useEffect(() => {
    if (!formData.race) {
      setRaceDetails(null);
      return;
    }

    setLoading(true);
    fetch(`https://www.dnd5eapi.co/api/2014/races/${formData.race.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setRaceDetails(data);
        setLoading(false);
        setTraitDescriptions({}); // Reset on race change
        setExpandedTrait(null);
      });
  }, [formData.race]);

  // Fetch trait details when expanded
  const handleToggleTrait = async (trait: Trait) => {
    const isOpen = expandedTrait === trait.index;
    if (isOpen) {
      setExpandedTrait(null);
    } else {
      setExpandedTrait(trait.index);

      // If not already fetched, fetch now
      if (!traitDescriptions[trait.index]) {
        const res = await fetch(`https://www.dnd5eapi.co${trait.url}`);
        const data: TraitDetails = await res.json();
        setTraitDescriptions((prev) => ({
          ...prev,
          [trait.index]: data.desc?.join("\n\n") || "No description available.",
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-yellow-300 mb-1">Select Race</label>
        <select
          value={formData.race}
          onChange={(e) => setFormData((prev) => ({ ...prev, race: e.target.value }))}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">-- Choose Race --</option>
          {raceList.map((race) => (
            <option key={race.index} value={race.index}>
              {race.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-gray-400 text-sm">Loading race details...</div>}

      {raceDetails && (
        <div className="space-y-4 text-sm text-white">
          <div>
            <h3 className="text-yellow-300 font-semibold">Ability Bonuses</h3>
            <ul className="list-disc list-inside text-gray-300">
              {raceDetails.ability_bonuses.map((bonus, idx) => (
                <li key={idx}>
                  {bonus.ability_score.name}: +{bonus.bonus}
                </li>
              ))}
            </ul>
          </div>

          {/* Description (if exists) */}
          {raceDetails.desc?.length > 0 && (
            <div>
              <h3 className="text-yellow-300 font-semibold">Description</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {raceDetails.desc.join("\n\n")}
              </p>
            </div>
          )}

          {/* Trait Accordions */}
          <div>
            <h3 className="text-yellow-300 font-semibold">Traits</h3>
            <div className="space-y-2">
              {raceDetails.traits.map((trait) => (
                <div key={trait.index} className="border border-gray-600 rounded">
                  <button
                    onClick={() => handleToggleTrait(trait)}
                    className="w-full text-left px-4 py-2 font-semibold text-yellow-300 flex justify-between items-center"
                  >
                    <span>{trait.name}</span>
                    <span>{expandedTrait === trait.index ? "▾" : "▸"}</span>
                  </button>
                  {expandedTrait === trait.index && (
                    <div className="px-4 py-2 text-gray-300 whitespace-pre-line">
                      {traitDescriptions[trait.index] || "Loading..."}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceStep;
