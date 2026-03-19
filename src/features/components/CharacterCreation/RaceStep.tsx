import React, { useEffect, useRef, useState } from "react";
import RaceSelector from "./RaceStep/RaceSelector";
import SubraceSelector from "./RaceStep/SubraceSelector";
import AbilityBonuses from "./RaceStep/AbilityBonuses";
import TraitAccordion from "./RaceStep/TraitAccordion";
import { CharacterStepProps } from "../../../types/character";
import {
  getRaceDetails,
  getRaces,
  getSubraceDetails,
  getSubracesByRace,
} from "../../../lib/dndData";

interface RaceOption {
  index: string;
  name: string;
}

interface AbilityBonus {
  ability: string;
  ability_name: string;
  bonus: number;
}

interface Trait {
  name: string;
  description: string;
}

interface RaceDetails {
  index: string;
  name: string;
  description: string[] | null;
  ability_bonuses: AbilityBonus[];
  traits: Trait[];
}

interface SubraceDetails {
  index: string;
  race_index: string;
  ability_bonuses: AbilityBonus[];
  traits: Trait[];
}

const RaceStep: React.FC<CharacterStepProps> = ({ formData, setFormData }) => {
  const [raceList, setRaceList] = useState<RaceOption[]>([]);
  const [subraceList, setSubraceList] = useState<RaceOption[]>([]);
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [subraceDetails, setSubraceDetails] = useState<SubraceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const previousRaceRef = useRef<string | undefined>(formData.race);

  useEffect(() => {
    const loadRaces = async () => {
      const races = await getRaces();
      setRaceList(races);
    };

    void loadRaces();
  }, []);

  useEffect(() => {
    const previousRace = previousRaceRef.current;
    const raceActuallyChanged = previousRace !== formData.race;
    previousRaceRef.current = formData.race;

    if (!formData.race) {
      setRaceDetails(null);
      setSubraceList([]);
      setSubraceDetails(null);
      setFormData((prev) => ({ ...prev, subrace: "", race_bonuses: {} }));
      return;
    }

    // Only clear subrace when race actually changes, not on remount
    if (raceActuallyChanged) {
      setSubraceDetails(null);
      setFormData((prev) => ({ ...prev, subrace: "" }));
    }

    setLoading(true);
    const loadRaceDetails = async () => {
      const [race, subraces] = await Promise.all([
        getRaceDetails(formData.race),
        getSubracesByRace(formData.race),
      ]);

      setRaceDetails(race as RaceDetails | null);
      setSubraceList(subraces);

      // After loading subraces, validate the current subrace selection
      // Keep it if valid, clear it if incompatible with the new race
      if (formData.subrace && subraces.length > 0) {
        const isValidSubrace = subraces.some((sr) => sr.index === formData.subrace);
        if (!isValidSubrace) {
          setFormData((prev) => ({ ...prev, subrace: "" }));
          setSubraceDetails(null);
        }
      }

      setLoading(false);
    };

    void loadRaceDetails().catch(() => {
      setRaceDetails(null);
      setSubraceList([]);
      setSubraceDetails(null);
      setLoading(false);
    });
  }, [formData.race, formData.subrace, setFormData]);

  useEffect(() => {
    if (!formData.subrace || !formData.race) {
      setSubraceDetails(null);
      return;
    }

    // Skip loading if subrace list hasn't loaded yet or subrace is invalid
    // (validation and clearing is handled in the race loading effect)
    if (subraceList.length > 0) {
      const isValidSubrace = subraceList.some((sr) => sr.index === formData.subrace);
      if (!isValidSubrace) {
        setSubraceDetails(null);
        return;
      }
    }

    const subraceIndex = formData.subrace;

    const loadSubraceDetails = async () => {
      const details = await getSubraceDetails(subraceIndex);
      setSubraceDetails(details as SubraceDetails | null);
    };

    void loadSubraceDetails().catch(() => {
      setSubraceDetails(null);
    });
  }, [formData.subrace, formData.race, subraceList]);

  useEffect(() => {
    const bonuses: Record<string, number> = {};

    const applyBonuses = (list: AbilityBonus[] = []) => {
      list.forEach(({ ability, bonus }) => {
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

      {subraceList.length > 0 && (
        <SubraceSelector
          subraces={subraceList}
          value={formData.subrace || ""}
          onChange={(val) => setFormData((prev) => ({ ...prev, subrace: val }))}
        />
      )}

      {loading && (
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Loading race details...
        </div>
      )}

      {(Array.isArray(raceDetails?.ability_bonuses) && raceDetails.ability_bonuses.length > 0) ||
      (Array.isArray(subraceDetails?.ability_bonuses) && subraceDetails.ability_bonuses.length > 0) ? (
        <div className="space-y-4">
          {Array.isArray(raceDetails?.ability_bonuses) && raceDetails.ability_bonuses.length > 0 && (
            <div className="p-4 rounded-lg bg-(--color-surface) border border-(--color-border)">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-accent)' }}>
                Race Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={raceDetails.ability_bonuses} />
            </div>
          )}

          {Array.isArray(subraceDetails?.ability_bonuses) && subraceDetails.ability_bonuses.length > 0 && (
            <div className="p-4 rounded-lg bg-(--color-surface) border border-(--color-border)">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-info)' }}>
                Subrace Ability Bonuses
              </h3>
              <AbilityBonuses bonuses={subraceDetails.ability_bonuses} />
            </div>
          )}
        </div>
      ) : null}

      {Array.isArray(raceDetails?.description) && raceDetails.description.length > 0 && (
        <div className="p-4 rounded-lg bg-(--color-surface) border border-(--color-border)">
          <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Description
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
            {raceDetails.description.join("\n\n")}
          </p>
        </div>
      )}

      {(Array.isArray(raceDetails?.traits) && raceDetails.traits.length > 0) ||
      (Array.isArray(subraceDetails?.traits) && subraceDetails.traits.length > 0) ? (
        <div className="space-y-4">
          {Array.isArray(raceDetails?.traits) && raceDetails.traits.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                Race Traits
              </h3>
              <TraitAccordion traits={raceDetails.traits} />
            </div>
          )}

          {Array.isArray(subraceDetails?.traits) && subraceDetails.traits.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
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