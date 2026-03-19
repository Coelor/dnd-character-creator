import React, { useEffect, useState } from "react";
import ClassSelector from "./ClassStep/ClassSelector";
import LevelSelector from "./ClassStep/LevelSelector";
import ProficiencyPicker from "./ClassStep/ProficiencyPicker";
import LevelAccordion from "./ClassStep/LevelAccordion";
import { CharacterStepProps } from "../../../types/character";
import { getClassDetails, getClasses, getClassLevels } from "../../../lib/dndData";

interface Feature {
  name: string;
  description: string;
}

interface ClassLevel {
  level: number;
  features: Feature[];
}

interface ClassOption {
  index: string;
  name: string;
}

const ClassStep: React.FC<CharacterStepProps> = ({ formData, setFormData }) => {
  const [classList, setClassList] = useState<ClassOption[]>([]);
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
    const loadClasses = async () => {
      const classes = await getClasses();
      setClassList(classes);
    };

    void loadClasses();
  }, []);

  useEffect(() => {
    if (!formData.class) {
      setLevelData([]);
      setFeatureDetails({});
      setProficiencyChoices(null);
      setSubclassLevel(null);
      return;
    }

    const classIndex = formData.class;

    const loadClassData = async () => {
      const [levels, classDetails] = await Promise.all([
        getClassLevels(classIndex),
        getClassDetails(classIndex),
      ]);

      const mappedLevels: ClassLevel[] = levels.map((level) => ({
        level: level.level,
        features: Array.isArray(level.features) ? level.features : [],
      }));

      setLevelData(mappedLevels);

      const detailsMap: Record<number, Record<string, string>> = {};
      const bonusList: { level: number; description: string }[] = [];

      for (const level of mappedLevels) {
        const detailAtLevel: Record<string, string> = {};

        for (const feature of level.features) {
          const description = feature.description || "No description available.";
          detailAtLevel[feature.name] = description;

          if (feature.name.toLowerCase().includes("ability score improvement")) {
            bonusList.push({ level: level.level, description });
          }
        }

        detailsMap[level.level] = detailAtLevel;
      }

      setFeatureDetails(detailsMap);
      setFormData((prev) => ({ ...prev, class_ability_bonuses: bonusList }));

      setProficiencyChoices(classDetails?.proficiency_choices ?? null);
      setSubclassLevel(classDetails?.subclass_level ?? null);
    };

    void loadClassData().catch(() => {
      setLevelData([]);
      setFeatureDetails({});
      setProficiencyChoices(null);
      setSubclassLevel(null);
      setFormData((prev) => ({ ...prev, class_ability_bonuses: [] }));
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
        formData={{
          level: formData.level ?? 1,
          class: formData.class ?? "",
          subclass: formData.subclass ?? undefined,
        }}
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
