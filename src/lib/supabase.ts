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

export interface Race {
  id: string
  name: string
  description: string
  ability_bonuses: any
  traits: any
  languages: string[]
  proficiencies: any
  created_by: string
  is_official: boolean
  created_at: string
}

export interface Class {
  id: string
  name: string
  description: string
  hit_die: number
  primary_ability: string
  saving_throws: string[]
  skills: string[]
  equipment: any
  created_by: string
  is_official: boolean
  created_at: string
}