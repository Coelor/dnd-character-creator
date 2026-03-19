import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

declare const process: {
  env: Record<string, string | undefined>
  exit: (_code?: number) => never
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Error: VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set in your environment.',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const API_BASE = 'https://www.dnd5eapi.co'

type AbilityBonus = {
  ability: string
  ability_name: string
  bonus: number
}

type TraitWithDescription = {
  name: string
  description: string
}

type ClassFeatureWithDescription = {
  name: string
  description: string
}

type TraitChoiceGroup = {
  choose: number
  options: string[]
}

async function fetchJson<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${API_BASE}${pathOrUrl}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed request (${res.status}) for ${url}`)
  }

  return (await res.json()) as T
}

function normalizeAbilityBonuses(list: Array<{ ability_score: { index: string; name: string }; bonus: number }> = []): AbilityBonus[] {
  return list.map((item) => ({
    ability: item.ability_score.index.toUpperCase(),
    ability_name: item.ability_score.name,
    bonus: item.bonus,
  }))
}

async function hydrateTraits(
  traits: Array<{ name: string; url?: string; desc?: string[]; index?: string }> = [],
): Promise<TraitWithDescription[]> {
  const hydrated = await Promise.all(
    traits.map(async (trait) => {
      if (Array.isArray(trait.desc) && trait.desc.length > 0) {
        return {
          name: trait.name,
          description: trait.desc.join('\n\n'),
        }
      }

      if (!trait.url) {
        return {
          name: trait.name,
          description: 'No description available.',
        }
      }

      try {
        const details = await fetchJson<{ desc?: string[] }>(trait.url)
        return {
          name: trait.name,
          description: details.desc?.join('\n\n') || 'No description available.',
        }
      } catch {
        return {
          name: trait.name,
          description: 'No description available.',
        }
      }
    }),
  )

  return hydrated
}

async function seedRacesAndSubraces() {
  console.log('Seeding races and subraces...')

  const racesList = await fetchJson<{ results: Array<{ index: string }> }>('/api/2014/races')
  const raceRows: Array<{
    index: string
    name: string
    description: string[]
    ability_bonuses: AbilityBonus[]
    traits: TraitWithDescription[]
  }> = []

  for (const race of racesList.results) {
    const raceDetails = await fetchJson<{
      index: string
      name: string
      desc?: string[]
      ability_bonuses?: Array<{ ability_score: { index: string; name: string }; bonus: number }>
      traits?: Array<{ name: string; url: string }>
    }>(`/api/2014/races/${race.index}`)

    raceRows.push({
      index: raceDetails.index,
      name: raceDetails.name,
      description: raceDetails.desc ?? [],
      ability_bonuses: normalizeAbilityBonuses(raceDetails.ability_bonuses),
      traits: await hydrateTraits(raceDetails.traits),
    })
  }

  const { error: racesError } = await supabase
    .from('dnd_races')
    .upsert(raceRows, { onConflict: 'index' })

  if (racesError) {
    throw racesError
  }

  const subracesList = await fetchJson<{ results: Array<{ index: string }> }>('/api/2014/subraces')

  const subraceRows: Array<{
    index: string
    name: string
    race_index: string
    ability_bonuses: AbilityBonus[]
    traits: TraitWithDescription[]
  }> = []

  for (const subrace of subracesList.results) {
    const subraceDetails = await fetchJson<{
      index: string
      name: string
      race?: { index: string }
      ability_bonuses?: Array<{ ability_score: { index: string; name: string }; bonus: number }>
      racial_traits?: Array<{ name: string; url: string }>
      traits?: Array<{ name: string; url: string }>
    }>(`/api/2014/subraces/${subrace.index}`)

    const traitSource = subraceDetails.racial_traits ?? subraceDetails.traits ?? []

    if (!subraceDetails.race?.index) {
      continue
    }

    subraceRows.push({
      index: subraceDetails.index,
      name: subraceDetails.name,
      race_index: subraceDetails.race.index,
      ability_bonuses: normalizeAbilityBonuses(subraceDetails.ability_bonuses),
      traits: await hydrateTraits(traitSource),
    })
  }

  const { error: subracesError } = await supabase
    .from('dnd_subraces')
    .upsert(subraceRows, { onConflict: 'index' })

  if (subracesError) {
    throw subracesError
  }
}

function normalizeProficiencyChoices(choice: {
  desc?: string
  choose?: number
  from?: {
    options?: Array<{
      item?: {
        name: string
        index: string
      }
      name?: string
      index?: string
    }>
  }
} | null): { desc: string; choose: number; options: Array<{ name: string; index: string }> } | null {
  if (!choice) return null

  const options = (choice.from?.options ?? [])
    .map((opt) => opt.item ?? (opt.name && opt.index ? { name: opt.name, index: opt.index } : null))
    .filter((opt): opt is { name: string; index: string } => Boolean(opt))

  return {
    desc: choice.desc ?? '',
    choose: choice.choose ?? 0,
    options,
  }
}

async function seedClassesLevelsAndSubclasses() {
  console.log('Seeding classes, levels, and subclasses...')

  const classesList = await fetchJson<{ results: Array<{ index: string }> }>('/api/classes')

  const classRows: Array<{
    index: string
    name: string
    hit_die: number | null
    subclass_level: number | null
    proficiency_choices: { desc: string; choose: number; options: Array<{ name: string; index: string }> } | null
  }> = []

  const levelRows: Array<{
    class_index: string
    level: number
    features: ClassFeatureWithDescription[]
  }> = []

  for (const cls of classesList.results) {
    const classDetails = await fetchJson<{
      index: string
      name: string
      hit_die?: number
      proficiency_choices?: Array<{
        desc?: string
        choose?: number
        from?: {
          options?: Array<{
            item?: {
              name: string
              index: string
            }
            name?: string
            index?: string
          }>
        }
      }>
    }>(`/api/2014/classes/${cls.index}`)

    classRows.push({
      index: classDetails.index,
      name: classDetails.name,
      hit_die: classDetails.hit_die ?? null,
      subclass_level: null, // Will be populated later from subclass data
      proficiency_choices: normalizeProficiencyChoices(classDetails.proficiency_choices?.[0] ?? null),
    })

    const levels = await fetchJson<
      Array<{
        level: number
        features?: Array<{ name: string; url: string }>
      }>
    >(`/api/classes/${cls.index}/levels`)

    for (const level of levels) {
      const features: ClassFeatureWithDescription[] = []

      for (const feature of level.features ?? []) {
        try {
          const details = await fetchJson<{ desc?: string[] }>(feature.url)
          features.push({
            name: feature.name,
            description: details.desc?.join('\n\n') || 'No description available.',
          })
        } catch {
          features.push({
            name: feature.name,
            description: 'No description available.',
          })
        }
      }

      levelRows.push({
        class_index: cls.index,
        level: level.level,
        features,
      })
    }
  }

  const { error: classError } = await supabase
    .from('dnd_classes')
    .upsert(classRows, { onConflict: 'index' })

  if (classError) {
    throw classError
  }

  const { error: levelError } = await supabase
    .from('dnd_class_levels')
    .upsert(levelRows, { onConflict: 'class_index,level' })

  if (levelError) {
    throw levelError
  }

  const subclassRows: Array<{
    index: string
    name: string
    class_index: string
    description: string[]
    subclass_flavor: string | null
  }> = []

  const subclassLevelRows: Array<{
    subclass_index: string
    level: number
    features: ClassFeatureWithDescription[]
  }> = []

  // Track the minimum subclass level per class to update classes later
  const classSubclassLevels: Record<string, number> = {}

  const subclassesList = await fetchJson<{ results: Array<{ index: string }> }>('/api/subclasses')

  for (const subclass of subclassesList.results) {
    const details = await fetchJson<{
      index: string
      name: string
      class?: { index: string }
      desc?: string[]
      subclass_flavor?: string
    }>(`/api/2014/subclasses/${subclass.index}`)

    if (!details.class?.index) {
      continue
    }

    subclassRows.push({
      index: details.index,
      name: details.name,
      class_index: details.class.index,
      description: details.desc ?? [],
      subclass_flavor: details.subclass_flavor ?? null,
    })

    // Fetch subclass levels
    const levels = await fetchJson<
      Array<{
        level: number
        features?: Array<{ name: string; url: string }>
      }>
    >(`/api/2014/subclasses/${subclass.index}/levels`)

    for (const level of levels) {
      const features: ClassFeatureWithDescription[] = []

      for (const feature of level.features ?? []) {
        try {
          const featureDetails = await fetchJson<{ desc?: string[] }>(feature.url)
          features.push({
            name: feature.name,
            description: featureDetails.desc?.join('\n\n') || 'No description available.',
          })
        } catch {
          features.push({
            name: feature.name,
            description: 'No description available.',
          })
        }
      }

      subclassLevelRows.push({
        subclass_index: details.index,
        level: level.level,
        features,
      })

      // Track the minimum level for this class's subclasses
      const classIndex = details.class.index
      if (!classSubclassLevels[classIndex] || level.level < classSubclassLevels[classIndex]) {
        classSubclassLevels[classIndex] = level.level
      }
    }
  }

  const { error: subclassError } = await supabase
    .from('dnd_subclasses')
    .upsert(subclassRows, { onConflict: 'index' })

  if (subclassError) {
    throw subclassError
  }

  const { error: subclassLevelError } = await supabase
    .from('dnd_subclass_levels')
    .upsert(subclassLevelRows, { onConflict: 'subclass_index,level' })

  if (subclassLevelError) {
    throw subclassLevelError
  }

  // Update classes with their subclass_level derived from subclass data
  for (const [classIndex, subclassLevel] of Object.entries(classSubclassLevels)) {
    const { error: updateError } = await supabase
      .from('dnd_classes')
      .update({ subclass_level: subclassLevel })
      .eq('index', classIndex)

    if (updateError) {
      console.warn(`Failed to update subclass_level for ${classIndex}:`, updateError.message)
    }
  }
}

function normalizeTraitGroup(group: {
  choose?: number
  from?: {
    options?: Array<{
      string?: string
      desc?: string
      item?: { name: string }
    }>
  }
} | null): TraitChoiceGroup | null {
  if (!group) return null

  const options = (group.from?.options ?? [])
    .map((option) => option.string ?? option.desc ?? option.item?.name)
    .filter((value): value is string => Boolean(value))

  return {
    choose: group.choose ?? 0,
    options,
  }
}

async function seedBackgrounds() {
  console.log('Seeding backgrounds...')

  const backgroundsList = await fetchJson<{ results: Array<{ index: string }> }>('/api/backgrounds')

  const backgroundRows: Array<{
    index: string
    name: string
    feature: { name: string; desc: string[] } | null
    personality_traits: TraitChoiceGroup | null
    ideals: TraitChoiceGroup | null
    bonds: TraitChoiceGroup | null
    flaws: TraitChoiceGroup | null
  }> = []

  for (const background of backgroundsList.results) {
    const details = await fetchJson<{
      index: string
      name: string
      feature?: { name: string; desc?: string[] }
      personality_traits?: {
        choose?: number
        from?: {
          options?: Array<{ string?: string; desc?: string; item?: { name: string } }>
        }
      }
      ideals?: {
        choose?: number
        from?: {
          options?: Array<{ string?: string; desc?: string; item?: { name: string } }>
        }
      }
      bonds?: {
        choose?: number
        from?: {
          options?: Array<{ string?: string; desc?: string; item?: { name: string } }>
        }
      }
      flaws?: {
        choose?: number
        from?: {
          options?: Array<{ string?: string; desc?: string; item?: { name: string } }>
        }
      }
    }>(`/api/backgrounds/${background.index}`)

    backgroundRows.push({
      index: details.index,
      name: details.name,
      feature: details.feature
        ? {
            name: details.feature.name,
            desc: details.feature.desc ?? [],
          }
        : null,
      personality_traits: normalizeTraitGroup(details.personality_traits ?? null),
      ideals: normalizeTraitGroup(details.ideals ?? null),
      bonds: normalizeTraitGroup(details.bonds ?? null),
      flaws: normalizeTraitGroup(details.flaws ?? null),
    })
  }

  const { error } = await supabase
    .from('dnd_backgrounds')
    .upsert(backgroundRows, { onConflict: 'index' })

  if (error) {
    throw error
  }
}

async function seedLanguages() {
  console.log('Seeding languages...')

  const languagesList = await fetchJson<{ results: Array<{ index: string }> }>('/api/2014/languages')

  const languageRows: Array<{
    index: string
    name: string
    type: string | null
  }> = []

  for (const language of languagesList.results) {
    const details = await fetchJson<{
      index: string
      name: string
      type?: string
    }>(`/api/2014/languages/${language.index}`)

    languageRows.push({
      index: details.index,
      name: details.name,
      type: details.type ?? null,
    })
  }

  const { error } = await supabase
    .from('dnd_languages')
    .upsert(languageRows, { onConflict: 'index' })

  if (error) {
    throw error
  }
}

async function main() {
  console.log('Starting D&D reference data seed...')

  await seedRacesAndSubraces()
  await seedClassesLevelsAndSubclasses()
  await seedBackgrounds()
  await seedLanguages()

  console.log('✅ D&D reference data seed complete.')
}

main().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
