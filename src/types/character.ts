export type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

// Shared shape - using snake_case to match database
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
    experience_points?: number;

    race_bonuses?: Record<Ability, number> | Record<string, number>;
    class_ability_bonuses?: { level: number; description: string }[];
    base_abilities?: Record<string, number>;

    extra_languages?: string[] | null;
    selected_traits?: {
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
    user_id?: string;
    created_at?: string;
    updated_at?: string;
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
