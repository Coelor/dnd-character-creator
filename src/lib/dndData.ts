import { supabase } from './supabase'
import type {
  Background,
  Class,
  ClassLevel,
  Language,
  Race,
  Subclass,
  Subrace,
} from './supabase'

export async function getRaces(): Promise<Array<Pick<Race, 'index' | 'name'>>> {
  try {
    const { data, error } = await supabase
      .from('dnd_races')
      .select('index, name')
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getRaceDetails(index: string): Promise<Race | null> {
  try {
    const { data, error } = await supabase
      .from('dnd_races')
      .select('*')
      .eq('index', index)
      .single()

    if (error) throw error
    return data
  } catch {
    return null
  }
}

export async function getSubracesByRace(raceIndex: string): Promise<Array<Pick<Subrace, 'index' | 'name'>>> {
  try {
    const { data, error } = await supabase
      .from('dnd_subraces')
      .select('index, name')
      .eq('race_index', raceIndex)
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getSubraceDetails(index: string): Promise<Subrace | null> {
  try {
    const { data, error } = await supabase
      .from('dnd_subraces')
      .select('*')
      .eq('index', index)
      .single()

    if (error) throw error
    return data
  } catch {
    return null
  }
}

export async function getClasses(): Promise<Array<Pick<Class, 'index' | 'name'>>> {
  try {
    const { data, error } = await supabase
      .from('dnd_classes')
      .select('index, name')
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getClassDetails(index: string): Promise<Class | null> {
  try {
    const { data, error } = await supabase
      .from('dnd_classes')
      .select('*')
      .eq('index', index)
      .single()

    if (error) throw error
    return data
  } catch {
    return null
  }
}

export async function getClassLevels(classIndex: string): Promise<ClassLevel[]> {
  try {
    const { data, error } = await supabase
      .from('dnd_class_levels')
      .select('*')
      .eq('class_index', classIndex)
      .order('level')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getSubclassesByClass(classIndex: string): Promise<Subclass[]> {
  try {
    const { data, error } = await supabase
      .from('dnd_subclasses')
      .select('*')
      .eq('class_index', classIndex)
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getBackgrounds(): Promise<Array<Pick<Background, 'index' | 'name'>>> {
  try {
    const { data, error } = await supabase
      .from('dnd_backgrounds')
      .select('index, name')
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export async function getBackgroundDetails(index: string): Promise<Background | null> {
  try {
    const { data, error } = await supabase
      .from('dnd_backgrounds')
      .select('*')
      .eq('index', index)
      .single()

    if (error) throw error
    return data
  } catch {
    return null
  }
}

export async function getLanguages(): Promise<Array<Pick<Language, 'index' | 'name'>>> {
  try {
    const { data, error } = await supabase
      .from('dnd_languages')
      .select('index, name')
      .order('name')

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}
