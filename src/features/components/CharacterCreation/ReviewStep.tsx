import { Badge } from "../../../components/ui/Badge";
import type { CharacterStepProps } from "../../../types/character";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

const ReviewStep = ({ formData }: CharacterStepProps) => {
  const {
    base_abilities = {} as Record<Ability, number>,
    race_bonuses = {} as Record<Ability, number>,
  } = formData;

  const abilities: Ability[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  const getTotal = (ability: Ability) => {
    return (base_abilities[ability] || 0) + (race_bonuses[ability] || 0);
  };

  const displayList = (items?: string[]) =>
    items && items.length > 0 ? (
      <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>None selected</p>
    );

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="p-4 rounded-lg bg-(--color-surface) border border-(--color-border)">
        <h2 className="text-heading-3 mb-4">Character Overview</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Name:</span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.name || 'Not set'}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Level:</span>{' '}
            <Badge variant="accent" size="sm">{formData.level}</Badge>
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Race:</span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.race}</span>
          </div>
          {formData.subrace && (
            <div>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Subrace:</span>{' '}
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.subrace}</span>
            </div>
          )}
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Class:</span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.class}</span>
          </div>
          {formData.subclass && (
            <div>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Subclass:</span>{' '}
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.subclass}</span>
            </div>
          )}
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Background:</span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.background}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Alignment:</span>{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formData.alignment}</span>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div>
        <h2 className="text-heading-3 mb-3">Ability Scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-(--color-border) rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-(--color-surface)">
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text)' }}>Ability</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-text)' }}>Base</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-text)' }}>Race</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--color-accent)' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {abilities.map((ability) => (
                <tr key={ability} className="border-t border-(--color-border)">
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text)' }}>{ability}</td>
                  <td className="px-4 py-3 text-center" style={{ color: 'var(--color-text)' }}>{base_abilities[ability] ?? "-"}</td>
                  <td className="px-4 py-3 text-center font-medium" style={{ color: 'var(--color-success)' }}>
                    {race_bonuses[ability] ? `+${race_bonuses[ability]}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--color-accent)' }}>{getTotal(ability)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proficiencies */}
      <div>
        <h2 className="text-heading-3 mb-3">Proficiencies</h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Class Proficiencies</h3>
            {displayList(formData.proficiencies ?? undefined)}
          </div>
          <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Race Proficiencies</h3>
            {displayList(Array.isArray(formData.raceProficiencies) ? formData.raceProficiencies : undefined)}
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-heading-3 mb-3">Languages</h2>
        <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
          {displayList(formData.extra_languages ?? undefined)}
        </div>
      </div>

      {/* Background Traits */}
      <div>
        <h2 className="text-heading-3 mb-3">Background Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["personality_traits", "ideals", "bonds", "flaws"].map((key) => (
            <div key={key} className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
              <h3 className="font-semibold mb-2 capitalize" style={{ color: 'var(--color-text)' }}>
                {key.replace(/_/g, " ")}
              </h3>
              {displayList(formData.selected_traits?.[key as keyof typeof formData.selected_traits])}
            </div>
          ))}
        </div>
      </div>

      {/* Class Ability Bonuses */}
      {formData.class_ability_bonuses && formData.class_ability_bonuses.length > 0 && (
        <div>
          <h2 className="text-heading-3 mb-3">Class Ability Score Increases</h2>
          <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
            <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
              {formData.class_ability_bonuses.map((bonus, i) => (
                <li key={i}>
                  <span className="font-medium">Level {bonus.level}:</span> {bonus.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;