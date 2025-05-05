// src/features/pages/CreateCharacterPage/ClassTab.tsx
import React, { useState, useEffect, ChangeEvent } from "react";

interface ClassOption {
  index: string;
  name: string;
  url: string;
}
interface ClassLevel {
  level: number;
  proficiency_bonus: number;
  ability_score_bonuses: number;
}

interface ClassTabProps {
  classValue: string;
  level: number;
  onClassChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onLevelChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function ClassTab({
  classValue,
  level,
  onClassChange,
  onLevelChange,
}: ClassTabProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [levels, setLevels] = useState<ClassLevel[]>([]);
  const [loading, setLoading] = useState<{ classes: boolean; levels: boolean }>({
    classes: false,
    levels: false,
  });
  const [error, setError] = useState<string | null>(null);

  // fetch class list
  useEffect(() => {
    setLoading((s) => ({ ...s, classes: true }));
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((r) => r.json())
      .then((data) => {
        setClasses(data.results);
        setError(null);
      })
      .catch(() => setError("Could not load classes"))
      .finally(() => setLoading((s) => ({ ...s, classes: false })));
  }, []);

  // fetch levels whenever a class is selected
  useEffect(() => {
    if (!classValue) {
      setLevels([]);
      return;
    }
    setLoading((s) => ({ ...s, levels: true }));
    fetch(`https://www.dnd5eapi.co/api/classes/${classValue}/levels`)
      .then((r) => r.json())
      .then((data: ClassLevel[]) => {
        setLevels(data);
        setError(null);
      })
      .catch(() => setError("Could not load level data"))
      .finally(() => setLoading((s) => ({ ...s, levels: false })));
  }, [classValue]);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4">
        {/* CLASS SELECTOR */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">Class</label>
          {loading.classes ? (
            <p>Loading classes…</p>
          ) : (
            <select
              name="class"
              value={classValue}
              onChange={onClassChange}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-black)",
                borderColor: "var(--color-border)",
              }}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.index} value={c.index}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* LEVEL SELECTOR */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">Level</label>
          <select
            name="level"
            value={level}
            onChange={onLevelChange}
            className="w-full p-2 border rounded"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-black)",
              borderColor: "var(--color-border)",
            }}
          >
            <option value="">Select level</option>
            {levels.map((lvl) => (
              <option key={lvl.level} value={lvl.level}>
                {lvl.level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LEVEL DETAILS */}
      {levels[level - 1] && (
        <div
          className="mt-4 p-4 rounded"
          style={{
            backgroundColor: "var(--color-surface)",
            border: `1px solid var(--color-border)`,
            color: "var(--color-black)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--color-primary-dark)" }}
          >
            {classes.find((c) => c.index === classValue)?.name} – Level {level}
          </h3>
          <p>
            <strong>Proficiency Bonus:</strong>{" "}
            {levels[level - 1].proficiency_bonus}
          </p>
          <p>
            <strong>Ability Score Bonuses:</strong>{" "}
            +{levels[level - 1].ability_score_bonuses}
          </p>
        </div>
      )}
    </div>
  );
}
