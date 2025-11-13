interface RaceOption {
  index: string;
  name: string;
}

interface RaceSelectorProps {
  value: string;
  onChange: (val: string) => void;
  raceList: RaceOption[];
}

const RaceSelector = ({ value, onChange, raceList }: RaceSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
        Select Race
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <option value="">-- Choose Race --</option>
        {raceList.map((race) => (
          <option key={race.index} value={race.index}>
            {race.name}
          </option>
        ))}
      </select>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        Your race determines ability bonuses and special traits
      </p>
    </div>
  );
};

export default RaceSelector;