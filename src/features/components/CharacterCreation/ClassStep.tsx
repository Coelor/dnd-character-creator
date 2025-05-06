import React, { useEffect, useState } from "react";
import { PALETTE } from "../DashboardLayout";

interface ClassStepProps {
  formData: {
    class: string;
    level: number;
    proficiencies?: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

interface Feature {
  name: string;
  url: string;
}

interface ClassLevel {
  level: number;
  features: Feature[];
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
  const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>([]);

  // Fetch class list on mount
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setClassList(data.results.map((cls: any) => cls.name)));
  }, []);

  // Fetch level and feature details + proficiencies
  useEffect(() => {
    if (!formData.class) {
      setProficiencyChoices(null);
      return;
    }

    const slug = formData.class.toLowerCase();

    fetch(`https://www.dnd5eapi.co/api/classes/${slug}/levels`)
      .then((res) => res.json())
      .then(async (levels) => {
        setLevelData(levels);

        const detailsMap: Record<number, Record<string, string>> = {};

        for (const level of levels) {
          const detailAtLevel: Record<string, string> = {};

          for (const feature of level.features) {
            const res = await fetch(`https://www.dnd5eapi.co${feature.url}`);
            const data = await res.json();
            detailAtLevel[feature.name] = data.desc?.join("\n\n") || "No description available.";
          }

          detailsMap[level.level] = detailAtLevel;
        }

        setFeatureDetails(detailsMap);
      });

    fetch(`https://www.dnd5eapi.co/api/classes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const choice = data.proficiency_choices?.[0];
        if (choice && choice.from?.options) {
          setProficiencyChoices({
            desc: choice.desc,
            choose: choice.choose,
            options: choice.from.options.map((opt: any) => ({
              name: opt.item.name,
              index: opt.item.index,
            })),
          });
        } else {
          setProficiencyChoices(null);
        }
      });
  }, [formData.class]);

  // Update formData when proficiencies change
  useEffect(() => {
    setFormData((prev) => ({ ...prev, proficiencies: selectedProficiencies }));
  }, [selectedProficiencies]);

  const handleToggle = (lvl: number) => {
    setExpanded(expanded === lvl ? null : lvl);
  };

  return (
    <div className="space-y-6">
      {/* Class + Level Row */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-yellow-300 mb-1">Select Class</label>
          <select
            value={formData.class}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, class: e.target.value }));
              setExpanded(null);
              setSelectedProficiencies([]);
            }}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">-- Choose Class --</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-300 mb-1">Character Level</label>
          <input
            type="number"
            min={1}
            max={20}
            value={formData.level}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, level: Number(e.target.value) }))
            }
            className="w-24 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>

      {/* Proficiency Picker */}
      {formData.class && proficiencyChoices && (
        <div className="space-y-2">
          <p className="text-sm text-yellow-300">{proficiencyChoices.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {proficiencyChoices.options.map((opt) => {
              const isSelected = selectedProficiencies.includes(opt.index);
              const disabled = !isSelected && selectedProficiencies.length >= proficiencyChoices.choose;

              return (
                <label
                  key={opt.index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded border 
                    ${isSelected ? "bg-purple-600 border-yellow-300 text-yellow-100" : "bg-gray-800 border-gray-600 text-white"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => {
                      setSelectedProficiencies((prev) =>
                        isSelected
                          ? prev.filter((p) => p !== opt.index)
                          : [...prev, opt.index]
                      );
                    }}
                  />
                  <span>{opt.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Accordion for Level Features */}
      {formData.class && levelData.length > 0 && (
        <div className="space-y-3">
          {levelData.slice(0, formData.level).map((lvl: ClassLevel) => (
            <div key={lvl.level} className="rounded border border-gray-600 bg-gray-800">
              <button
                className="w-full flex justify-between items-center px-4 py-2 text-left text-sm font-semibold text-yellow-300"
                onClick={() => handleToggle(lvl.level)}
              >
                <span>Level {lvl.level}</span>
                <span>{expanded === lvl.level ? "▾" : "▸"}</span>
              </button>

              {expanded === lvl.level && (
                <div className="px-4 py-2 space-y-3 text-white text-sm">
                  {lvl.features.length > 0 ? (
                    lvl.features.map((f, i) => (
                      <div key={i} className="space-y-1">
                        <div className="font-semibold">• {f.name}</div>
                        <div className="text-gray-300 whitespace-pre-line">
                          {featureDetails?.[lvl.level]?.[f.name] || "Loading..."}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No features listed</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassStep;
