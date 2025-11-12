import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import type { CharacterInput } from "../../../types/character";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface AbilitiesStepProps {
    formData: Pick<
        CharacterInput,
        "race_bonuses" | "class_ability_bonuses" | "base_abilities"
    >;
    setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
}

const standardArray: number[] = [15, 14, 13, 12, 10, 8];

const AbilitiesStep = ({
    formData,
    setFormData,
}: AbilitiesStepProps) => {
    const defaultAbilities: Record<Ability, number> = {
        STR: 8,
        DEX: 8,
        CON: 8,
        INT: 8,
        WIS: 8,
        CHA: 8,
    };

    const [mode, setMode] = useState<"manual" | "array-random" | "array-manual">(
        "manual"
    );
    const [base_abilities, setBaseAbilities] = useState<Record<Ability, number>>(
        formData.base_abilities || defaultAbilities
    );

    const abilities: Ability[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

    useEffect(() => {
        setFormData((prev: CharacterInput) => ({
            ...prev,
            base_abilities,
        }));
    }, [base_abilities, setFormData]);

    const handleRandomize = () => {
        const roll = () => {
            const dice = Array.from({ length: 4 }, () =>
                Math.ceil(Math.random() * 6)
            );
            return dice
                .sort((a, b) => b - a)
                .slice(0, 3)
                .reduce((a, b) => a + b, 0);
        };
        const rolled = abilities.reduce(
            (acc, ability) => {
                acc[ability] = roll();
                return acc;
            },
            {} as Record<Ability, number>
        );
        setBaseAbilities(rolled);
    };

    const race_bonuses: Record<Ability, number> = formData.race_bonuses || {
        STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0
    };

    const classBonuses: Record<Ability, number> = (() => {
        const bonusMap: Record<Ability, number> = {
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0,
        };
        const keywords: Record<string, Ability> = {
            strength: "STR",
            dexterity: "DEX",
            constitution: "CON",
            intelligence: "INT",
            wisdom: "WIS",
            charisma: "CHA",
        };

        formData.class_ability_bonuses?.forEach(({ description }) => {
            const lower = description.toLowerCase();
            for (const [word, abbr] of Object.entries(keywords)) {
                const matchCount = lower.split(word).length - 1;
                bonusMap[abbr] += matchCount;
            }
        });

        return bonusMap;
    })();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                    Ability Score Method
                </label>
                <div className="flex gap-3 flex-wrap">
                    <Button
                        variant={mode === "manual" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => {
                            setMode("manual");
                            setBaseAbilities(formData.base_abilities || defaultAbilities);
                        }}
                    >
                        Manual Entry
                    </Button>
                    <Button
                        variant={mode === "array-manual" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => {
                            setMode("array-manual");
                            const mapped = {} as Record<Ability, number>;
                            abilities.forEach((ability, i) => {
                                mapped[ability] = standardArray[i] ?? 8;
                            });
                            setBaseAbilities(mapped);
                        }}
                    >
                        Standard Array
                    </Button>
                    <Button
                        variant={mode === "array-random" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => {
                            setMode("array-random");
                            handleRandomize();
                        }}
                    >
                        Roll Dice
                    </Button>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  {mode === "manual" && "Enter ability scores manually (3-18)"}
                  {mode === "array-manual" && "Assign standard array values: 15, 14, 13, 12, 10, 8"}
                  {mode === "array-random" && "Randomly roll 4d6, drop lowest for each ability"}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-(--color-border) rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-(--color-surface)">
                            <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text)' }}>
                                Ability
                            </th>
                            <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-text)' }}>
                                Base
                            </th>
                            <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-text)' }}>
                                Race
                            </th>
                            <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-text)' }}>
                                Class
                            </th>
                            <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-accent)' }}>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {abilities.map((ability) => {
                            const base = base_abilities[ability] || 0;
                            const race = race_bonuses[ability] || 0;
                            const cls = classBonuses[ability] || 0;
                            const total = base + race + cls;

                            return (
                                <tr key={ability} className="border-t border-(--color-border)">
                                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>
                                        {ability}
                                    </td>
                                    <td className="px-4 py-3 text-center">
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
                                                className="input-field w-20 text-center"
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
                                                className="input-field w-24 text-center"
                                            >
                                                <option value="">--</option>
                                                {standardArray.map((val) => {
                                                    const isUsed = Object.entries(base_abilities).some(
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
                                            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                                                {base}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium" style={{ color: 'var(--color-success)' }}>
                                        {race > 0 ? `+${race}` : race || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium" style={{ color: 'var(--color-info)' }}>
                                        {cls > 0 ? `+${cls}` : cls || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: 'var(--color-accent)' }}>
                                        {total}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AbilitiesStep;