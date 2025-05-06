import React from "react";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface ReviewStepProps {
    formData: {
        race: string;
        subrace?: string;
        class: string;
        subclass?: string;
        level: number;
        background: string;

        // Abilities
        baseAbilities?: Record<Ability, number>;
        raceBonuses?: Record<Ability, number>;
        classAbilityBonuses?: { level: number; description: string }[];

        // Proficiencies
        proficiencies?: string[];
        raceProficiencies?: string[];
        extraLanguages?: string[];

        // Traits
        selectedTraits?: {
            personality_traits?: string[];
            ideals?: string[];
            bonds?: string[];
            flaws?: string[];
        };
    };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
    const { baseAbilities = {}, raceBonuses = {}, classAbilityBonuses = [] } = formData;
    const abilities: Ability[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

    const getTotal = (ability: Ability) => {
        return (baseAbilities[ability] || 0) + (raceBonuses[ability] || 0);
    };

    const displayList = (items?: string[]) =>
        items && items.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300">
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500">None selected</p>
        );

    return (
        <div className="space-y-6 text-white">
            {/* Basic Info */}
            <div>
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">Overview</h2>
                <p>Race: <strong>{formData.race}</strong></p>
                {formData.subrace && <p>Subrace: <strong>{formData.subrace}</strong></p>}
                <p>Class: <strong>{formData.class}</strong></p>
                {formData.subclass && <p>Subclass: <strong>{formData.subclass}</strong></p>}
                <p>Level: <strong>{formData.level}</strong></p>
                <p>Background: <strong>{formData.background}</strong></p>
            </div>

            {/* Abilities Table */}
            <div>
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">Ability Scores</h2>
                <table className="w-full text-sm border border-gray-600">
                    <thead className="bg-gray-800 text-yellow-300">
                        <tr>
                            <th className="px-2 py-1 text-left">Ability</th>
                            <th className="px-2 py-1 text-center">Base</th>
                            <th className="px-2 py-1 text-center">Race Bonus</th>
                            <th className="px-2 py-1 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abilities.map((ability) => (
                            <tr key={ability} className="border-t border-gray-700">
                                <td className="px-2 py-1">{ability}</td>
                                <td className="px-2 py-1 text-center">{baseAbilities[ability] ?? "-"}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{raceBonuses[ability] ?? 0}</td>
                                <td className="px-2 py-1 text-center font-semibold">{getTotal(ability)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Proficiencies */}
            <div>
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">Proficiencies</h2>
                <h3 className="font-semibold text-white">Class Proficiencies:</h3>
                {displayList(formData.proficiencies)}

                <h3 className="font-semibold text-white mt-2">Race Proficiencies:</h3>
                {displayList(formData.raceProficiencies)}
            </div>

            {/* Languages */}
            <div>
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">Languages</h2>
                {displayList(formData.extraLanguages)}
            </div>

            {/* Background Traits */}
            <div>
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">Background Traits</h2>

                {["personality_traits", "ideals", "bonds", "flaws"].map((key) => (
                    <div key={key}>
                        <h3 className="text-white font-medium capitalize">{key.replace(/_/g, " ")}</h3>
                        {displayList(formData.selectedTraits?.[key as keyof typeof formData.selectedTraits])}
                    </div>
                ))}
            </div>

            {/* Class Ability Bonuses */}
            {formData.classAbilityBonuses && formData.classAbilityBonuses.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-yellow-300 mb-2">Class Ability Score Increases</h2>
                    <ul className="list-disc list-inside text-gray-300">
                        {formData.classAbilityBonuses.map((bonus, i) => (
                            <li key={i}>
                                Level {bonus.level}: {bonus.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ReviewStep;
