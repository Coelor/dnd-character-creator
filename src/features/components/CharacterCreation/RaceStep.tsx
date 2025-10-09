import React, { useEffect, useState } from "react";
import RaceSelector from "./RaceStep/RaceSelector";
import SubraceSelector from "./RaceStep/SubraceSelector";
import AbilityBonuses from "./RaceStep/AbilityBonuses";
import TraitAccordion from "./RaceStep/TraitAccordion";
import { CharacterStepProps } from "../../../types/character";

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

interface RaceDetails {
  name: string;
  ability_bonuses: AbilityBonus[];
  desc?: string[];
  traits: Trait[];
  subraces: { index: string; name: string; url: string }[];
}

interface SubraceDetails {
  ability_bonuses: AbilityBonus[];
  traits: Trait[];
}

const RaceStep: React.FC<CharacterStepProps> = ({ formData, setFormData }) => {
  const [raceList, setRaceList] = useState<RaceSummary[]>([]);
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [subraceDetails, setSubraceDetails] = useState<SubraceDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races")
      .then((res) => res.json())
      .then((data) => setRaceList(data.results));
  }, []);

  useEffect(() => {
    if (!formData.race) {
      setRaceDetails(null);
      setFormData((prev) => ({ ...prev, subrace: "", race_bonuses: {} }));
      return;
    }

    setLoading(true);
    fetch(`https://www.dnd5eapi.co/api/2014/races/${formData.race}`)
      .then((res) => res.json())
      .then((data) => {
        setRaceDetails(data);
        setLoading(false);
      });
  }, [formData.race, setFormData]);

  useEffect(() => {
    if (!formData.subrace || !formData.race) {
      setSubraceDetails(null);
      return;
    }

    fetch(`https://www.dnd5eapi.co/api/2014/subraces/${formData.subrace}`)
      .then((res) => res.json())
      .then((data) => {
        setSubraceDetails(data);
      });
  }, [formData.subrace, formData.race]);

  useEffect(() => {
    const bonuses: Record<string, number> = {};

    const applyBonuses = (list: AbilityBonus[] = []) => {
      list.forEach(({ ability_score, bonus }) => {
        const ability = ability_score.index.toUpperCase();
        bonuses[ability] = (bonuses[ability] || 0) + bonus;
      });
    };

    applyBonuses(raceDetails?.ability_bonuses);
    applyBonuses(subraceDetails?.ability_bonuses);

    setFormData((prev) => ({ ...prev, race_bonuses: bonuses }));
  }, [raceDetails, subraceDetails, setFormData]);

  return (
    <div className="space-y-6">
      <RaceSelector
        value={formData.race}
        onChange={(val) => setFormData((prev) => ({ ...prev, race: val }))}
        raceList={raceList}
      />

      {Array.isArray(raceDetails?.subraces) && raceDetails.subraces.length > 0 && (
        <SubraceSelector
          subraces={raceDetails.subraces}
          value={formData.subrace || ""}
          onChange={(val) => setFormData((prev) => ({ ...prev, subrace: val }))}
        />
      )}

      {loading && <div className="text-sm text-gray-400">Loading race details...</div>}

      {(Array.isArray(raceDetails?.ability_bonuses) && raceDetails.ability_bonuses.length > 0) ||
      (Array.isArray(subraceDetails?.ability_bonuses) && subraceDetails.ability_bonuses.length > 0) ? (
        <div className="space-y-4">
          {Array.isArray(raceDetails?.ability_bonuses) && raceDetails.ability_bonuses.length > 0 && (
            <div>
              <h3 className="text-yellow-300 font-semibold border-b border-gray-700 pb-1">
                Race Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={raceDetails.ability_bonuses} />
            </div>
          )}

          {Array.isArray(subraceDetails?.ability_bonuses) && subraceDetails.ability_bonuses.length > 0 && (
            <div>
              <h3 className="text-purple-300 font-semibold border-b border-gray-700 pb-1">
                Subrace Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={subraceDetails.ability_bonuses} />
            </div>
          )}
        </div>
      ) : null}

      {Array.isArray(raceDetails?.desc) && raceDetails.desc.length > 0 && (
        <div>
          <h3 className="text-yellow-300 font-semibold">Description</h3>
          <p className="text-gray-300 whitespace-pre-line">{raceDetails.desc.join("\n\n")}</p>
        </div>
      )}

      {(Array.isArray(raceDetails?.traits) && raceDetails.traits.length > 0) ||
      (Array.isArray(subraceDetails?.traits) && subraceDetails.traits.length > 0) ? (
        <div className="space-y-4">
          {Array.isArray(raceDetails?.traits) && raceDetails.traits.length > 0 && (
            <div>
              <h3 className="text-yellow-300 font-semibold border-b border-gray-700 pb-1">
                Race Traits
              </h3>
              <TraitAccordion traits={raceDetails.traits} />
            </div>
          )}

          {Array.isArray(subraceDetails?.traits) && subraceDetails.traits.length > 0 && (
            <div>
              <h3 className="text-purple-300 font-semibold border-b border-gray-700 pb-1">
                Subrace Traits
              </h3>
              <TraitAccordion traits={subraceDetails.traits} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RaceStep;