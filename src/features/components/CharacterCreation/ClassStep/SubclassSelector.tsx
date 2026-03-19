import React, { useEffect, useState } from "react";
import { getSubclassesByClass } from "../../../../lib/dndData";

interface SubclassSelectorProps {
  className: string;
  level: number;
  selected: string;
  setSelected: (val: string) => void;
}

interface Subclass {
  name: string;
  description: string[] | null;
  index: string;
}

const SubclassSelector: React.FC<SubclassSelectorProps> = ({
  className,
  selected,
  setSelected,
}) => {
  const [subclasses, setSubclasses] = useState<Subclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!className) {
      setSubclasses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const loadSubclasses = async () => {
      const results = await getSubclassesByClass(className);
      setSubclasses(results);

      // Clear subclass if current selection is not in the new list
      if (selected && results.length > 0) {
        const isValidSubclass = results.some((sub) => sub.index === selected);
        if (!isValidSubclass) {
          setSelected("");
        }
      }

      setLoading(false);
    };

    void loadSubclasses().catch(() => {
      setError("Failed to load subclasses.");
      setLoading(false);
    });
  }, [className, selected, setSelected]);
  

  if (loading) {
    return <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading subclasses...</div>;
  }

  if (error) {
    return <div className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</div>;
  }

  if (subclasses.length === 0) {
    return <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No subclasses available for this class.</div>;
  }

  return (
    <div className="mt-4 space-y-2">
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
        Choose a Subclass
      </label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="input-field"
      >
        <option value="">-- Select Subclass --</option>
        {subclasses.map((sub) => (
          <option key={sub.index} value={sub.index}>
            {sub.name}
          </option>
        ))}
      </select>

      {selected && (
        <div className="text-sm mt-2 whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
          {subclasses.find((s) => s.index === selected)?.description?.join("\n\n")}
        </div>
      )}
    </div>
  );
};

export default SubclassSelector;
