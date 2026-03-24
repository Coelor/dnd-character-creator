import { Input } from '../../../components/ui/Input';
import type { CharacterInput } from '../../../types/character';

interface CharacterSummaryPanelProps {
  formData: CharacterInput;
  setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
}

function formatIndex(index: string): string {
  return index
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface SummaryChipProps {
  label: string;
  value: string;
}

function SummaryChip({ label, value }: SummaryChipProps) {
  const hasValue = Boolean(value);
  return (
    <div className="flex flex-col gap-0.5 min-w-[60px]">
      <span
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${!hasValue ? 'italic' : ''}`}
        style={{ color: hasValue ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
      >
        {hasValue ? formatIndex(value) : '—'}
      </span>
    </div>
  );
}

const CharacterSummaryPanel = ({ formData, setFormData }: CharacterSummaryPanelProps) => {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Name Input */}
      <div className="w-full sm:w-60 shrink-0">
        <Input
          label="Character Name"
          type="text"
          value={formData.name ?? ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter character name…"
        />
      </div>

      {/* Vertical divider (desktop) */}
      <div
        className="hidden sm:block self-stretch w-px"
        style={{ background: 'var(--color-border)' }}
      />

      {/* Horizontal divider (mobile) */}
      <div
        className="block sm:hidden w-full h-px"
        style={{ background: 'var(--color-border)' }}
      />

      {/* Summary chips */}
      <div className="flex flex-wrap gap-5">
        <SummaryChip label="Race" value={formData.race ?? ''} />
        {formData.subrace && (
          <SummaryChip label="Subrace" value={formData.subrace} />
        )}
        <SummaryChip label="Class" value={formData.class ?? ''} />
        {formData.subclass && (
          <SummaryChip label="Subclass" value={formData.subclass} />
        )}
      </div>
    </div>
  );
};

export default CharacterSummaryPanel;
