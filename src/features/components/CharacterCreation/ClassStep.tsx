import React, { useEffect, useState } from "react";
import ClassSelector from "./ClassStep/ClassSelector";
import LevelSelector from "./ClassStep/LevelSelector";
import ProficiencyPicker from "./ClassStep/ProficiencyPicker";
import LevelAccordion from "./ClassStep/LevelAccordion";
import { CharacterInput } from "../../../types/character";

interface ClassStepProps {
  formData: {
    class: string;
    level: number;
    proficiencies?: string[];
    subclass?: string;
    classAbilityBonuses?: { level: number; description: string }[];
  };
  setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
}

interface Feature {
  name: string;
  url: string;
}

interface ClassLevel {
  level: number;
  features: Feature[];
}

interface ProficiencyOption {
  item: {
    name: string;
    index: string;
  };
}

const ClassStep: React.FC<ClassStepProps> = ({ formData, setFormData }) => {
  const [classList, setClassList] = useState<string[]>([]);
  const [levelData, setLevelData] = useState<ClassLevel[]>([]);
  const [featureDetails, setFeatureDetails] = useState<Record<number, Record<string, string>>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [proficiencyChoices, setProficiencyChoices] = useState<{
    desc: string;
    choose: number;
    options: { name: string; index: string }[];
  } | null>(null);
  const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>(formData.proficiencies || []);
  const [subclassLevel, setSubclassLevel] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setClassList(data.results.map((cls: { name: string }) => cls.name)));
  }, []);

  useEffect(() => {
    if (!formData.class) {
      setProficiencyChoices(null);
      setSubclassLevel(null);
      return;
    }

    const slug = formData.class.toLowerCase();

    fetch(`https://www.dnd5eapi.co/api/classes/${slug}/levels`)
      .then((res) => res.json())
      .then(async (levels) => {
        setLevelData(levels);
        const detailsMap: Record<number, Record<string, string>> = {};
        const bonusList: { level: number; description: string }[] = [];

        for (const level of levels) {
          const detailAtLevel: Record<string, string> = {};

          for (const feature of level.features) {
            const res = await fetch(`https://www.dnd5eapi.co${feature.url}`);
            const data = await res.json();
            const description = data.desc?.join("\n\n") || "No description available.";
            detailAtLevel[feature.name] = description;

            if (feature.name.toLowerCase().includes("ability score improvement")) {
              bonusList.push({ level: level.level, description });
            }
          }

          detailsMap[level.level] = detailAtLevel;
        }

        setFeatureDetails(detailsMap);
        setFormData((prev) => ({ ...prev, classAbilityBonuses: bonusList }));
      });

    fetch(`https://www.dnd5eapi.co/api/2014/classes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const choice = data.proficiency_choices?.[0];
        if (choice && choice.from?.options) {
          setProficiencyChoices({
            desc: choice.desc,
            choose: choice.choose,
            options: choice.from.options.map((opt: ProficiencyOption) => ({
              name: opt.item.name,
              index: opt.item.index,
            })),
          });
        } else {
          setProficiencyChoices(null);
        }

        if (data.subclass_level) {
          setSubclassLevel(data.subclass_level);
        } else {
          setSubclassLevel(null);
        }
      });
  }, [formData.class, setFormData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, proficiencies: selectedProficiencies }));
  }, [selectedProficiencies, setFormData]);

  const handleToggle = (lvl: number) => {
    setExpanded(expanded === lvl ? null : lvl);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <ClassSelector
          formData={formData}
          setFormData={setFormData}
          classList={classList}
          resetProficiencies={() => setSelectedProficiencies([])}
        />
        <LevelSelector formData={formData} setFormData={setFormData} />
      </div>

      {formData.class && proficiencyChoices && (
        <ProficiencyPicker
          proficiencyChoices={proficiencyChoices}
          selected={selectedProficiencies}
          setSelected={setSelectedProficiencies}
        />
      )}

      {formData.class && levelData.length > 0 && (
        <LevelAccordion
          levelData={levelData}
          featureDetails={featureDetails}
          formData={formData}
          expanded={expanded}
          handleToggle={handleToggle}
          setFormData={setFormData}
          subclassLevel={subclassLevel}
        />
      )}
    </div>
  );
};

export default ClassStep;
