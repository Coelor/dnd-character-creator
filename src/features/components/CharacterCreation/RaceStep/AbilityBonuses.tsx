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
    <div className="space-y-2">
      <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
        {bonuses.map((bonus, idx) => (
          <li key={idx}>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {bonus.ability_score.name}:
            </span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
              +{bonus.bonus}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AbilityBonuses;