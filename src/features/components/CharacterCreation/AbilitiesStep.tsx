import React, { useState, useEffect } from "react";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface AbilitiesStepProps {
  formData: {
    raceBonuses?: Record<Ability, number>;
    classAbilityBonuses?: { level: number; description: string }[];
    baseAbilities?: Record<Ability, number>;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const standardArray: number[] = [15, 14, 13, 12, 10, 8];

const AbilitiesStep: React.FC<AbilitiesStepProps> = ({ formData, setFormData }) => {
  const defaultAbilities: Record<Ability, number> = {
    STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8,
  };

  const [mode, setMode] = useState<"manual" | "array-random" | "array-manual">("manual");
  const [baseAbilities, setBaseAbilities] = useState<Record<Ability, number>>(
    formData.baseAbilities || defaultAbilities
  );

  const abilities: Ability[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  // Save changes to parent
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      baseAbilities,
    }));
  }, [baseAbilities]);

  const handleRandomize = () => {
    const roll = () => {
      const dice = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
      return dice.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0);
    };
    const rolled = abilities.reduce((acc, ability) => {
      acc[ability] = roll();
      return acc;
    }, {} as Record<Ability, number>);
    setBaseAbilities(rolled);
  };

  const raceBonuses = formData.raceBonuses || {};

  const classBonuses: Record<Ability, number> = (() => {
    const bonusMap: Record<Ability, number> = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    const keywords: Record<string, Ability> = {
      strength: "STR",
      dexterity: "DEX",
      constitution: "CON",
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
    };

    formData.classAbilityBonuses?.forEach(({ description }) => {
      const lower = description.toLowerCase();
      for (const [word, abbr] of Object.entries(keywords)) {
        const matchCount = lower.split(word).length - 1;
        bonusMap[abbr] += matchCount;
      }
    });

    return bonusMap;
  })();

  const usedArrayValues = new Set(Object.values(baseAbilities));
  const availableStandardArray = standardArray.filter((val) =>
    Object.values(baseAbilities).includes(val)
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-yellow-300 mb-2">
          Ability Input Method
        </label>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setMode("manual");
              setBaseAbilities(formData.baseAbilities || defaultAbilities);
            }}
            className={`px-4 py-1 rounded text-sm font-medium border ${
              mode === "manual"
                ? "bg-yellow-300 text-black"
                : "bg-gray-700 text-white border-gray-500"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => {
              setMode("array-manual");
              const mapped = {} as Record<Ability, number>;
              abilities.forEach((ability, i) => {
                mapped[ability] = standardArray[i] ?? 8;
              });
              setBaseAbilities(mapped);
            }}
            className={`px-4 py-1 rounded text-sm font-medium border ${
              mode === "array-manual"
                ? "bg-yellow-300 text-black"
                : "bg-gray-700 text-white border-gray-500"
            }`}
          >
            Standard Array (Manual Assign)
          </button>
          <button
            onClick={() => {
              setMode("array-random");
              handleRandomize();
            }}
            className={`px-4 py-1 rounded text-sm font-medium border ${
              mode === "array-random"
                ? "bg-yellow-300 text-black"
                : "bg-gray-700 text-white border-gray-500"
            }`}
          >
            Random
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-white border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-yellow-300">
            <th className="px-2 py-1 text-left">Ability</th>
            <th className="px-2 py-1 text-center">Base</th>
            <th className="px-2 py-1 text-center">Race Bonus</th>
            <th className="px-2 py-1 text-center">Class Bonus</th>
            <th className="px-2 py-1 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {abilities.map((ability) => {
            const base = baseAbilities[ability] || 0;
            const race = raceBonuses[ability] || 0;
            const cls = classBonuses[ability] || 0;
            const total = base + race + cls;

            return (
              <tr key={ability} className="border-t border-gray-600">
                <td className="px-2 py-1 font-medium">{ability}</td>
                <td className="px-2 py-1 text-center">
                  {mode === "manual" ? (
                    <input
                      type="number"
                      min={3}
                      max={18}
                      value={base}
                      onChange={(e) =>
                        setBaseAbilities((prev) => ({
                          ...prev,
                          [ability]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-500 text-center"
                    />
                  ) : mode === "array-manual" ? (
                    <select
                      value={base}
                      onChange={(e) =>
                        setBaseAbilities((prev) => ({
                          ...prev,
                          [ability]: parseInt(e.target.value),
                        }))
                      }
                      className="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-500 text-center"
                    >
                      <option value="">--</option>
                      {standardArray.map((val) => {
                        const isUsed =
                          Object.entries(baseAbilities).some(
                            ([key, assigned]) =>
                              key !== ability && assigned === val
                          );
                        return (
                          <option key={val} value={val} disabled={isUsed}>
                            {val}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    base
                  )}
                </td>
                <td className="px-2 py-1 text-center text-yellow-300">{race}</td>
                <td className="px-2 py-1 text-center text-purple-300">{cls}</td>
                <td className="px-2 py-1 text-center font-bold">{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AbilitiesStep;
