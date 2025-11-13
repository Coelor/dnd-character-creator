import { Input } from "../../../components/ui/Input";
import type { CharacterInput, CharacterStepProps } from "../../../types/character";

const alignments = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

const BasicsStep = ({ formData, setFormData }: CharacterStepProps) => {
  const handleAlignmentSelect = (alignment: string) => {
    setFormData((prev: CharacterInput) => ({ ...prev, alignment }));
  };

  return (
    <div className="space-y-6">
      {/* Character Name Input */}
      <Input
        label="Character Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData((prev: CharacterInput) => ({ ...prev, name: e.target.value }))}
        placeholder="Enter your character's name..."
        helperText="Choose a memorable name for your character"
      />

      {/* Alignment Grid */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          Alignment
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {alignments.map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => handleAlignmentSelect(alignment)}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all
                ${formData.alignment === alignment
                  ? 'bg-(--color-accent) border-(--color-accent) text-white'
                  : 'bg-(--color-bg) border-(--color-border) hover:border-(--color-accent)'
                }
              `}
              style={
                formData.alignment !== alignment
                  ? { color: 'var(--color-text)' }
                  : undefined
              }
            >
              {alignment}
            </button>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Select your character's moral and ethical outlook
        </p>
      </div>
    </div>
  );
};

export default BasicsStep;