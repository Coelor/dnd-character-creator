import { Check, Star } from 'lucide-react';

interface ProficiencyChipProps {
  name: string;
  proficient: boolean;
  expertise?: boolean;
  bonus?: number;
  onClick?: () => void;
}

export function ProficiencyChip({ name, proficient, expertise = false, bonus, onClick }: ProficiencyChipProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg border transition-all
        ${onClick ? 'cursor-pointer hover:border-(--color-accent)' : 'cursor-default'}
        ${proficient || expertise ? 'bg-(--color-accent-light) border-(--color-accent)' : 'bg-(--color-surface) border-(--color-border)'}
      `}
    >
      <div className="flex items-center gap-2">
        {expertise ? (
          <Star size={14} style={{ color: 'var(--color-accent)' }} fill="var(--color-accent)" />
        ) : proficient ? (
          <Check size={14} style={{ color: 'var(--color-accent)' }} />
        ) : (
          <div className="w-3.5 h-3.5" />
        )}
        <span
          className="text-sm font-medium"
          style={{ color: proficient || expertise ? 'var(--color-accent)' : 'var(--color-text)' }}
        >
          {name}
        </span>
      </div>
      {bonus !== undefined && (
        <span
          className="text-sm font-semibold ml-2"
          style={{ color: proficient || expertise ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
        >
          {bonus >= 0 ? `+${bonus}` : bonus}
        </span>
      )}
    </button>
  );
}