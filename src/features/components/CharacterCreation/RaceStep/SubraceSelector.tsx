interface Subrace {
  index: string;
  name: string;
  url: string;
}

interface SubraceSelectorProps {
  subraces: Subrace[];
  value: string;
  onChange: (value: string) => void;
}

const SubraceSelector = ({ subraces, value, onChange }: SubraceSelectorProps) => {
  if (subraces.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
        Select Subrace
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <option value="">-- Choose Subrace --</option>
        {subraces.map((subrace) => (
          <option key={subrace.index} value={subrace.index}>
            {subrace.name}
          </option>
        ))}
      </select>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        Subraces provide additional bonuses and features
      </p>
    </div>
  );
};

export default SubraceSelector;