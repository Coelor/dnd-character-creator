import type { Ability } from '../../types/character';

interface AbilityScoreCardProps {
  ability: Ability;
  score: number;
  modifier?: number;
  size?: 'sm' | 'md' | 'lg';
}

function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function AbilityScoreCard({ ability, score, modifier, size = 'md' }: AbilityScoreCardProps) {
  const mod = modifier ?? calculateModifier(score);
  const modifierText = mod >= 0 ? `+${mod}` : `${mod}`;
  
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-20 h-24',
    lg: 'w-24 h-28',
  };
  
  const textSizes = {
    sm: { ability: 'text-xs', modifier: 'text-lg', score: 'text-xs' },
    md: { ability: 'text-sm', modifier: 'text-2xl', score: 'text-sm' },
    lg: { ability: 'text-base', modifier: 'text-3xl', score: 'text-base' },
  };
  
  return (
    <div
      className={`${sizeClasses[size]} flex flex-col items-center justify-center border-2 rounded-lg bg-(--color-surface)`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className={`${textSizes[size].ability} font-semibold`} style={{ color: 'var(--color-text-secondary)' }}>
        {ability}
      </div>
      <div className={`${textSizes[size].modifier} font-bold`} style={{ color: 'var(--color-text)' }}>
        {modifierText}
      </div>
      <div className={`${textSizes[size].score} font-medium`} style={{ color: 'var(--color-text-muted)' }}>
        ({score})
      </div>
    </div>
  );
}