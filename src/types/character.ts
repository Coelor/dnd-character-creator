export type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

// Shared shape
interface BaseCharacter {
    id?: string | null;
    name?: string | null;
    level?: number | null;
    alignment?: string | null;
    race?: string | null;
    subrace?: string | null;
    class?: string | null;
    subclass?: string | null;
    background?: string | null;

    raceBonuses?: Record<Ability, number> | null;
    classAbilityBonuses?: { level: number; description: string }[] | null;
    baseAbilities?: Record<Ability, number> | null;

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
