// src/features/pages/CreateCharacterPage/ClassTab.tsx
import React, { useEffect, useState, ChangeEvent } from "react";

interface ClassOption {
  index: string;
  name: string;
}

interface ClassLevelProps {
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
}: ClassLevelProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of classes once
  useEffect(() => {
    setLoading(true);
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.results);
        setError(null);
      })
      .catch(() => setError("Failed to load classes"))
      .finally(() => setLoading(false));
  }, []);

  // Static levels 1–20
  const levelOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4">
        {/* CLASS SELECTOR */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">Class</label>
          {loading ? (
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
            disabled={!classValue}
            className="w-full p-2 border rounded"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-black)",
              borderColor: "var(--color-border)",
            }}
          >
            <option value="">Select level</option>
            {levelOptions.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
