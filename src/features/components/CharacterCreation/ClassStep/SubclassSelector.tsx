import React, { useEffect, useState } from "react";

interface SubclassSelectorProps {
  className: string;
  level: number;
  selected: string;
  setSelected: (val: string) => void;
}

interface Subclass {
  name: string;
  desc: string[];
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
    if (!className) return;
  
    setLoading(true);
    setError(null);
    const slug = className.toLowerCase();
  
    fetch(`https://www.dnd5eapi.co/api/2014/classes/${slug}`)
      .then((res) => res.json())
      .then(async (data) => {
        const subclassList = data.subclasses || [];
  
        if (!subclassList.length) {
          setSubclasses([]);
          setLoading(false);
          return;
        }
  
        const results: Subclass[] = [];
  
        for (const entry of subclassList) {
          const res = await fetch(`https://www.dnd5eapi.co${entry.url}`);
          const full = await res.json();
          results.push({
            name: full.name,
            desc: full.desc,
            index: full.index,
          });
        }
  
        setSubclasses(results);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subclasses.");
        setLoading(false);
      });
  }, [className]);
  

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
          {subclasses.find((s) => s.index === selected)?.desc.join("\n\n")}
        </div>
      )}
    </div>
  );
};

export default SubclassSelector;
