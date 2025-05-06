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
      <h3 className="text-yellow-300 font-semibold mb-1">Choose up to {max} Additional Language(s)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.index);
          const disabled = !isSelected && selectedLanguages.length >= max;

          return (
            <label
              key={lang.index}
              className={`flex items-center space-x-2 px-3 py-1 rounded border text-sm ${
                isSelected
                  ? "bg-purple-600 border-yellow-300 text-yellow-100"
                  : "bg-gray-800 border-gray-600 text-white"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggleLanguage(lang.index)}
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
