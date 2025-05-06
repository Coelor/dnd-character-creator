export type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

// Shared shape
interface BaseCharacter {
    id?: string | null;
    name?: string;
    level?: number | 1;
    alignment: string;
    race: string;
    subrace?: string | "";
    class: string;
    subclass?: string | "";
    background: string;

    raceBonuses?: Record<Ability, number> | Record<string, number>;
    classAbilityBonuses?: { level: number; description: string }[];
    baseAbilities?: Record<Ability, number> | Record<string, number>;

    extraLanguages?: string[] | null;
    selectedTraits?: {
        personality_traits: string[];
        ideals: string[];
        bonds: string[];
        flaws: string[];
    } | null;

    proficiencies?: string[] | null;
    hp?: string | null;
    ac?: number | null;
    init?: number | null;
    img?: string | null;
    [key: string]: unknown;
}

// For creating a new character (client → backend)
export type CharacterInput = BaseCharacter;

// For reading from the DB (backend → client)
export interface RawCharacter extends BaseCharacter {
    owner?: string | null;
}

export type CharacterStepProps = {
    formData: CharacterInput;
    setFormData: React.Dispatch<React.SetStateAction<CharacterInput>>;
};
