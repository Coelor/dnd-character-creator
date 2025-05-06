import React from "react";

interface RaceOption {
  index: string;
  name: string;
}

interface RaceSelectorProps {
  value: string;
  onChange: (val: string) => void;
  raceList: RaceOption[];
}

const RaceSelector: React.FC<RaceSelectorProps> = ({ value, onChange, raceList }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-yellow-300 mb-1">
        Select Race
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="">-- Choose Race --</option>
        {raceList.map((race) => (
          <option key={race.index} value={race.index}>
            {race.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RaceSelector;
