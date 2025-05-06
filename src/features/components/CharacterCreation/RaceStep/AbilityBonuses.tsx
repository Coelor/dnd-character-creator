import React from "react";

interface AbilityBonus {
  ability_score: {
    index: string;
    name: string;
  };
  bonus: number;
}

interface AbilityBonusesProps {
  bonuses: AbilityBonus[];
}

const AbilityBonuses: React.FC<AbilityBonusesProps> = ({ bonuses }) => {
  return (
    <div>
      <h3 className="text-yellow-300 font-semibold mb-1">Ability Bonuses</h3>
      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
        {bonuses.map((bonus, idx) => (
          <li key={idx}>
            {bonus.ability_score.name}: +{bonus.bonus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AbilityBonuses;
