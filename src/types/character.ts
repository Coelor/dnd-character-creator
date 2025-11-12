export type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityScores {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}

export interface Skill {
    name: string;
    ability: Ability;
    proficient: boolean;
    expertise: boolean;
}

export interface Spell {
    id: string;
    name: string;
    level: number;
    school: string;
    casting_time: string;
    range: string;
    components: string;
    duration: string;
    description: string;
    prepared?: boolean;
}

export interface SpellSlots {
    level: number;
    total: number;
    used: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    weight?: number;
    description?: string;
}

export interface Feature {
    name: string;
    description: string;
    source: string;
}

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

// Enhanced Character type with all computed fields
export interface Character extends BaseCharacter {
    id: string;
    name: string;
    
    // Computed values
    proficiency_bonus?: number;
    saves?: Record<Ability, { value: number; proficient: boolean }>;
    skills?: Skill[];
    
    // Combat stats
    hp_max?: number;
    hp_current?: number;
    hp_temp?: number;
    
    // Features and traits
    features?: Feature[];
    traits?: string[];
    languages?: string[];
    
    // Spellcasting
    spells?: {
        known: Spell[];
        slots_by_level: SpellSlots[];
        spell_dc?: number;
        spell_attack_bonus?: number;
    };
    
    // Inventory
    inventory?: {
        items: InventoryItem[];
        weight?: number;
        notes?: string;
    };
    
    // Notes
    notes?: string;
    
    // Metadata
    metadata?: {
        is_homebrew: boolean;
        tags: string[];
        is_draft?: boolean;
    };
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