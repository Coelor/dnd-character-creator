import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (we'll expand these as we build the schema)
export interface Character {
  id: string
  name: string
  race: string
  class: string
  background: string
  alignment: string
  level: number
  experience_points: number
  race_bonuses: any
  class_ability_bonuses: any
  extra_languages: any
  selected_traits: any
  proficiencies: any
  base_abilities: any
  hp: string
  ac: number
  init: number
  img?: string
  subrace?: string
  subclass?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface DndAbilityBonus {
  ability: string
  ability_name: string
  bonus: number
}

export interface DndTrait {
  name: string
  description: string
}

export interface Race {
  id: string
  index: string
  name: string
  description: string[] | null
  ability_bonuses: DndAbilityBonus[] | null
  traits: DndTrait[] | null
}

export interface Class {
  id: string
  index: string
  name: string
  hit_die: number | null
  subclass_level: number | null
  proficiency_choices: {
    desc: string
    choose: number
    options: Array<{
      name: string
      index: string
    }>
  } | null
}

export interface Subrace {
  id: string
  index: string
  name: string
  race_index: string
  ability_bonuses: DndAbilityBonus[] | null
  traits: DndTrait[] | null
}

export interface ClassLevel {
  id: string
  class_index: string
  level: number
  features: Array<{
    name: string
    description: string
  }> | null
}

export interface Subclass {
  id: string
  index: string
  name: string
  class_index: string
  description: string[] | null
}

export interface Background {
  id: string
  index: string
  name: string
  feature: {
    name: string
    desc: string[]
  } | null
  personality_traits: {
    choose: number
    options: string[]
  } | null
  ideals: {
    choose: number
    options: string[]
  } | null
  bonds: {
    choose: number
    options: string[]
  } | null
  flaws: {
    choose: number
    options: string[]
  } | null
}

export interface Language {
  id: string
  index: string
  name: string
  type: string | null
}