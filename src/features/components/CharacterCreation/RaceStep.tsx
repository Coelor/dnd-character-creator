import React, { useEffect, useState } from "react";
import RaceSelector from "./RaceStep/RaceSelector";
import SubraceSelector from "./RaceStep/SubraceSelector";
import AbilityBonuses from "./RaceStep/AbilityBonuses";
import TraitAccordion from "./RaceStep/TraitAccordion";

interface RaceStepProps {
  formData: {
    race: string;
    subrace?: string;
    raceProficiencies?: string[];
    raceAbilityBonuses?: AbilityBonus[];
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
  index?: string;
}

interface Proficiency {
  index: string;
  name: string;
}

interface RaceDetails {
  name: string;
  ability_bonuses: AbilityBonus[];
  desc?: string[];
  traits: Trait[];
  subraces: { index: string; name: string; url: string }[];
  starting_proficiencies: Proficiency[];
}

interface SubraceDetails {
  ability_bonuses: AbilityBonus[];
  traits: Trait[];
  starting_proficiencies?: Proficiency[];
}

const RaceStep: React.FC<RaceStepProps> = ({ formData, setFormData }) => {
  const [raceList, setRaceList] = useState<RaceSummary[]>([]);
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [subraceDetails, setSubraceDetails] = useState<SubraceDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all races
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/races")
      .then((res) => res.json())
      .then((data) => setRaceList(data.results));
  }, []);

  // Fetch selected race
  useEffect(() => {
    if (!formData.race) {
      setRaceDetails(null);
      setFormData((prev) => ({ ...prev, subrace: "" }));
      return;
    }

    setLoading(true);
    fetch(`https://www.dnd5eapi.co/api/2014/races/${formData.race}`)
      .then((res) => res.json())
      .then((data) => {
        setRaceDetails(data);
        setLoading(false);
        setFormData((prev) => ({ ...prev, subrace: "" }));
      });
  }, [formData.race]);

  // Fetch selected subrace
  useEffect(() => {
    if (!formData.subrace) {
      setSubraceDetails(null);
      return;
    }

    fetch(`https://www.dnd5eapi.co/api/2014/subraces/${formData.subrace}`)
      .then((res) => res.json())
      .then((data) => {
        setSubraceDetails(data);
      });
  }, [formData.subrace]);

  // Merge and export bonuses + proficiencies
  // Merge and export bonuses + proficiencies
useEffect(() => {
    const raceBonuses = raceDetails?.ability_bonuses || [];
    const subraceBonuses = subraceDetails?.ability_bonuses || [];
    const allBonuses = [...raceBonuses, ...subraceBonuses];
  
    const raceProfs = raceDetails?.starting_proficiencies || [];
    const subraceProfs = subraceDetails?.starting_proficiencies || [];
    const allProfs = [...raceProfs, ...subraceProfs];
  
    // Transform bonuses to a flat Record<Ability, number>
    const bonusMap = allBonuses.reduce((acc, bonus) => {
      const ability = bonus.ability_score.index.toUpperCase();
      acc[ability] = (acc[ability] || 0) + bonus.bonus;
      return acc;
    }, {} as Record<string, number>);
  
    setFormData((prev) => ({
      ...prev,
      raceAbilityBonuses: allBonuses,
      raceBonuses: bonusMap,
      raceProficiencies: allProfs.map((p) => p.name),
    }));
  }, [raceDetails, subraceDetails]);
  

  return (
    <div className="space-y-6">
      <RaceSelector
        value={formData.race}
        onChange={(val) => setFormData((prev) => ({ ...prev, race: val }))}
        raceList={raceList}
      />

      {raceDetails?.subraces?.length > 0 && (
        <SubraceSelector
          subraces={raceDetails.subraces}
          value={formData.subrace || ""}
          onChange={(val) => setFormData((prev) => ({ ...prev, subrace: val }))}
        />
      )}

      {loading && <div className="text-sm text-gray-400">Loading race details...</div>}

      {/* Ability Bonuses */}
      {(raceDetails?.ability_bonuses.length || subraceDetails?.ability_bonuses?.length) && (
        <div className="space-y-4">
          {raceDetails?.ability_bonuses.length > 0 && (
            <div>
              <h3 className="text-yellow-300 font-semibold border-b border-gray-700 pb-1">
                Race Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={raceDetails.ability_bonuses} />
            </div>
          )}

          {subraceDetails?.ability_bonuses?.length > 0 && (
            <div>
              <h3 className="text-purple-300 font-semibold border-b border-gray-700 pb-1">
                Subrace Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={subraceDetails.ability_bonuses} />
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {raceDetails?.desc?.length > 0 && (
        <div>
          <h3 className="text-yellow-300 font-semibold">Description</h3>
          <p className="text-gray-300 whitespace-pre-line">
            {raceDetails.desc.join("\n\n")}
          </p>
        </div>
      )}

      {/* Traits */}
      {(raceDetails?.traits.length || subraceDetails?.traits?.length) && (
        <div className="space-y-4">
          {raceDetails?.traits.length > 0 && (
            <div>
              <h3 className="text-yellow-300 font-semibold border-b border-gray-700 pb-1">
                Race Traits
              </h3>
              <TraitAccordion traits={raceDetails.traits} />
            </div>
          )}

          {subraceDetails?.traits?.length > 0 && (
            <div>
              <h3 className="text-purple-300 font-semibold border-b border-gray-700 pb-1">
                Subrace Traits
              </h3>
              <TraitAccordion traits={subraceDetails.traits} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaceStep;
