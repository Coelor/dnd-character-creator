/**
 * Utility script to generate invite codes for the D&D Character Creator
 *
 * Usage:
 *   npx tsx scripts/generate-invite-codes.ts [options]
 *
 * Options:
 *   --count <number>     Number of codes to generate (default: 1)
 *   --max-uses <number>  Max uses per code (default: 1)
 *   --expires <days>     Days until expiration (default: never)
 *   --prefix <string>    Custom prefix for codes (default: random)
 *
 * Examples:
 *   npx tsx scripts/generate-invite-codes.ts --count 5
 *   npx tsx scripts/generate-invite-codes.ts --count 1 --max-uses 10 --expires 30
 *   npx tsx scripts/generate-invite-codes.ts --count 3 --prefix BETA
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface Options {
  count: number
  maxUses: number
  expires?: number
  prefix?: string
}

function parseArgs(): Options {
  const args = process.argv.slice(2)
  const options: Options = {
    count: 1,
    maxUses: 1,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--count':
        options.count = parseInt(args[++i]) || 1
        break
      case '--max-uses':
        options.maxUses = parseInt(args[++i]) || 1
        break
      case '--expires':
        options.expires = parseInt(args[++i])
        break
      case '--prefix':
        options.prefix = args[++i]
        break
      case '--help':
      case '-h':
        console.log(`
Invite Code Generator

Usage:
  npx tsx scripts/generate-invite-codes.ts [options]

Options:
  --count <number>     Number of codes to generate (default: 1)
  --max-uses <number>  Max uses per code (default: 1)
  --expires <days>     Days until expiration (default: never)
  --prefix <string>    Custom prefix for codes (default: random)
  --help, -h          Show this help message

Examples:
  npx tsx scripts/generate-invite-codes.ts --count 5
  npx tsx scripts/generate-invite-codes.ts --count 1 --max-uses 10 --expires 30
  npx tsx scripts/generate-invite-codes.ts --count 3 --prefix BETA
        `)
        process.exit(0)
    }
  }

  return options
}

function generateCode(prefix?: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = prefix ? 8 : 12
  let code = prefix || ''

  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

async function generateInviteCodes(options: Options) {
  console.log('\nGenerating invite codes...\n')

  const codes: Array<{
    code: string
    max_uses: number
    expires_at?: string
  }> = []

  // Generate unique codes
  const existingCodes = new Set<string>()

  for (let i = 0; i < options.count; i++) {
    let code: string
    do {
      code = generateCode(options.prefix)
    } while (existingCodes.has(code))

    existingCodes.add(code)

    const codeData: any = {
      code,
      max_uses: options.maxUses,
    }

    if (options.expires) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + options.expires)
      codeData.expires_at = expiryDate.toISOString()
    }

    codes.push(codeData)
  }

  // Insert codes into database
  const { data, error } = await supabase
    .from('invite_codes')
    .insert(codes)
    .select()

  if (error) {
    console.error('Error creating invite codes:', error.message)
    process.exit(1)
  }

  console.log(`✅ Successfully created ${codes.length} invite code(s):\n`)

  codes.forEach((code, index) => {
    console.log(`${index + 1}. ${code.code}`)
    console.log(`   Max uses: ${code.max_uses}`)
    if (code.expires_at) {
      console.log(`   Expires: ${new Date(code.expires_at).toLocaleDateString()}`)
    } else {
      console.log(`   Expires: Never`)
    }
    console.log()
  })

  console.log('Share these codes with users who should have access to the application.\n')
}

// Main execution
const options = parseArgs()
generateInviteCodes(options).catch(console.error)
