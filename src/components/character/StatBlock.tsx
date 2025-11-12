import { AbilityScoreCard } from './AbilityScoreCard';
import type { Ability, AbilityScores } from '../../types/character';

interface StatBlockProps {
  abilities: AbilityScores;
  size?: 'sm' | 'md' | 'lg';
}

const ABILITIES: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export function StatBlock({ abilities, size = 'md' }: StatBlockProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ABILITIES.map((ability) => (
        <AbilityScoreCard
          key={ability}
          ability={ability}
          score={abilities[ability] || 10}
          size={size}
        />
      ))}
    </div>
  );
}