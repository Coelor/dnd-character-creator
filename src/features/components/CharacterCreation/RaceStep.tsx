import React, { useEffect, useState } from "react";
import RaceSelector from "./RaceStep/RaceSelector";
import SubraceSelector from "./RaceStep/SubraceSelector";
import AbilityBonuses from "./RaceStep/AbilityBonuses";
import TraitAccordion from "./RaceStep/TraitAccordion";

interface RaceStepProps {
  formData: {
    race: string;
    subrace?: string;
    raceBonuses?: Record<string, number>;
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

const RaceStep: React.FC<RaceStepProps> = ({ formData, setFormData }) => {
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
      setFormData((prev) => ({ ...prev, subrace: "", raceBonuses: {} }));
      return;
    }

    setLoading(true);
    fetch(`https://www.dnd5eapi.co/api/2014/races/${formData.race}`)
      .then((res) => res.json())
      .then((data) => {
        setRaceDetails(data);
        setLoading(false);
        // Do not reset subrace here — allow it to persist across steps
      });
  }, [formData.race]);

  // ✅ Ensure subrace details are always updated if race/subrace are set
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

  // ✅ Compute and export ability bonuses
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

    setFormData((prev) => ({ ...prev, raceBonuses: bonuses }));
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
