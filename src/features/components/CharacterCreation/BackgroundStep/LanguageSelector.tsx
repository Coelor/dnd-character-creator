import React, { useEffect, useState } from "react";

interface LanguageSelectorProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  max: number;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  setSelectedLanguages,
  max,
}) => {
  const [languages, setLanguages] = useState<{ index: string; name: string }[]>([]);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/2014/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data.results));
  }, []);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else if (selectedLanguages.length < max) {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-3" style={{ color: 'var(--color-accent)' }}>
        Choose up to {max} Additional Language(s)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.index);
          const disabled = !isSelected && selectedLanguages.length >= max;

          return (
            <label
              key={lang.index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                isSelected
                  ? "bg-(--color-accent) border-(--color-accent) text-white"
                  : "bg-(--color-bg) border-(--color-border) hover:border-(--color-accent)"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              style={
                !isSelected && !disabled
                  ? { color: 'var(--color-text)' }
                  : undefined
              }
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggleLanguage(lang.index)}
                className="accent-[var(--color-accent)]"
              />
              <span>{lang.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
