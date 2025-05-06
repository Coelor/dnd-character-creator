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
    return <div className="text-sm text-gray-400">Loading subclasses...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  if (subclasses.length === 0) {
    return <div className="text-sm text-gray-400">No subclasses available for this class.</div>;
  }

  return (
    <div className="mt-4 space-y-2">
      <label className="block text-sm font-medium text-yellow-300">Choose a Subclass</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="">-- Select Subclass --</option>
        {subclasses.map((sub) => (
          <option key={sub.index} value={sub.index}>
            {sub.name}
          </option>
        ))}
      </select>

      {selected && (
        <div className="text-sm text-gray-300 mt-2 whitespace-pre-line">
          {subclasses.find((s) => s.index === selected)?.desc.join("\n\n")}
        </div>
      )}
    </div>
  );
};

export default SubclassSelector;
