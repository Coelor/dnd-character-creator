import { useState } from 'react';
import { ArrowLeft, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatBlock } from '../../components/character/StatBlock';
import { HPTracker } from '../../components/character/HPTracker';
import { StatBadge } from '../../components/character/StatBadge';
import { ProficiencyChip } from '../../components/character/ProficiencyChip';
import type { AbilityScores, Skill } from '../../types/character';

export default function CharacterSheetPage() {
  const navigate = useNavigate();
  
  // Mock character data
  const character = {
    name: 'Thorin Ironforge',
    class: 'Fighter',
    subclass: 'Battle Master',
    level: 5,
    race: 'Dwarf',
    subrace: 'Mountain Dwarf',
    background: 'Soldier',
    alignment: 'Lawful Good',
  };

  const abilities: AbilityScores = {
    STR: 16,
    DEX: 12,
    CON: 16,
    INT: 10,
    WIS: 13,
    CHA: 8,
  };

  const [hp, setHp] = useState({ current: 42, max: 52, temp: 0 });

  const skills: Skill[] = [
    { name: 'Athletics', ability: 'STR', proficient: true, expertise: false },
    { name: 'Acrobatics', ability: 'DEX', proficient: false, expertise: false },
    { name: 'Sleight of Hand', ability: 'DEX', proficient: false, expertise: false },
    { name: 'Stealth', ability: 'DEX', proficient: false, expertise: false },
    { name: 'Arcana', ability: 'INT', proficient: false, expertise: false },
    { name: 'History', ability: 'INT', proficient: false, expertise: false },
    { name: 'Investigation', ability: 'INT', proficient: false, expertise: false },
    { name: 'Nature', ability: 'INT', proficient: false, expertise: false },
    { name: 'Religion', ability: 'INT', proficient: false, expertise: false },
    { name: 'Animal Handling', ability: 'WIS', proficient: false, expertise: false },
    { name: 'Insight', ability: 'WIS', proficient: false, expertise: false },
    { name: 'Medicine', ability: 'WIS', proficient: false, expertise: false },
    { name: 'Perception', ability: 'WIS', proficient: true, expertise: false },
    { name: 'Survival', ability: 'WIS', proficient: true, expertise: false },
    { name: 'Deception', ability: 'CHA', proficient: false, expertise: false },
    { name: 'Intimidation', ability: 'CHA', proficient: true, expertise: false },
    { name: 'Performance', ability: 'CHA', proficient: false, expertise: false },
    { name: 'Persuasion', ability: 'CHA', proficient: false, expertise: false },
  ];

  const calculateModifier = (score: number): number => Math.floor((score - 10) / 2);
  const proficiencyBonus = 3;

  const getSkillBonus = (skill: Skill): number => {
    const abilityMod = calculateModifier(abilities[skill.ability]);
    const profBonus = skill.expertise ? proficiencyBonus * 2 : skill.proficient ? proficiencyBonus : 0;
    return abilityMod + profBonus;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/characters')}>
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-1">{character.name}</h1>
              <Badge variant="accent">Level {character.level}</Badge>
            </div>
            <p className="text-body mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {character.race} {character.class} ({character.subclass}) • {character.background}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit</Button>
          <Button>Level Up</Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Abilities, Saves, Skills */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ability Scores */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Ability Scores</h3>
            </CardHeader>
            <CardContent>
              <StatBlock abilities={abilities} size="sm" />
            </CardContent>
          </Card>

          {/* Proficiency Bonus */}
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Proficiency Bonus
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  +{proficiencyBonus}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Saving Throws */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Saving Throws</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map((ability) => {
                const proficient = ability === 'STR' || ability === 'CON';
                const bonus = calculateModifier(abilities[ability]) + (proficient ? proficiencyBonus : 0);
                return (
                  <ProficiencyChip
                    key={ability}
                    name={ability}
                    proficient={proficient}
                    bonus={bonus}
                  />
                );
              })}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Skills</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {skills.map((skill) => (
                <ProficiencyChip
                  key={skill.name}
                  name={skill.name}
                  proficient={skill.proficient}
                  expertise={skill.expertise}
                  bonus={getSkillBonus(skill)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Features, Actions, Spells */}
        <div className="lg:col-span-6 space-y-6">
          {/* Features & Traits */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Features & Traits</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Second Wind
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  You can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Action Surge
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Extra Attack
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  You can attack twice, instead of once, whenever you take the Attack action on your turn.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-(--color-border) hover:border-(--color-accent) transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Longsword
                  </h4>
                  <Badge size="sm">+6 to hit</Badge>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Melee Weapon Attack • 1d8 + 3 slashing damage
                </p>
              </div>
              <div className="p-3 rounded-lg border border-(--color-border) hover:border-(--color-accent) transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium" style={{ color: 'var(--color-text)' }}>
                    Handaxe
                  </h4>
                  <Badge size="sm">+6 to hit</Badge>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Melee or Ranged Weapon Attack • 1d6 + 3 slashing damage
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - HP, AC, Initiative, Inventory */}
        <div className="lg:col-span-3 space-y-6">
          {/* Combat Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatBadge
              icon={<Shield size={20} />}
              label="Armor Class"
              value={18}
              size="sm"
            />
            <StatBadge
              icon={<Zap size={20} />}
              label="Initiative"
              value="+1"
              size="sm"
            />
          </div>

          {/* HP Tracker */}
          <HPTracker
            current={hp.current}
            max={hp.max}
            temp={hp.temp}
            onChange={(current, temp) => setHp({ ...hp, current, temp })}
          />

          {/* Speed */}
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Speed
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  25 ft
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Inventory</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text)' }}>Longsword</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text)' }}>Chain Mail</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text)' }}>Shield</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text)' }}>Handaxe</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text)' }}>Backpack</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>1</span>
              </div>
              <div className="pt-2 border-t border-(--color-border)">
                <Button variant="ghost" size="sm" fullWidth>
                  Manage Inventory
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Notes</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                A gruff but honorable dwarf warrior from the Iron Hills. Seeks to restore his clan's honor.
              </p>
              <Button variant="ghost" size="sm" fullWidth className="mt-3">
                Edit Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}