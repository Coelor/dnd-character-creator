# Invite Code System

This application uses an invite-only authentication system to control access. Users must provide a valid invite code during signup.

## Features

- ✅ Invite codes required for signup
- ✅ Configurable max uses per code
- ✅ Optional expiration dates
- ✅ Code usage tracking
- ✅ Row-level security policies
- ✅ Easy code generation via CLI

## Setup Instructions

### 1. Run the Database Migration

You need to execute the SQL migration to create the invite codes tables and functions in your Supabase database.

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_invite_codes.sql`
5. Paste it into the SQL editor
6. Click **Run** or press `Ctrl/Cmd + Enter`

**Option B: Using Supabase CLI**

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push the migration
supabase db push
```

### 2. Verify the Migration

After running the migration, verify that:

1. Tables exist: `invite_codes` and `invite_code_uses`
2. Functions exist: `validate_invite_code` and `use_invite_code`
3. A default code `WELCOME2024` was created (or create your own)

You can check this in the Supabase dashboard under:
- **Database** → **Tables** (should see `invite_codes` and `invite_code_uses`)
- **Database** → **Functions** (should see the RPC functions)

### 3. Generate Invite Codes

Use the provided script to generate new invite codes:

```bash
# Generate a single code
npx tsx scripts/generate-invite-codes.ts

# Generate 5 codes
npx tsx scripts/generate-invite-codes.ts --count 5

# Generate a code that can be used 10 times
npx tsx scripts/generate-invite-codes.ts --max-uses 10

# Generate a code that expires in 30 days
npx tsx scripts/generate-invite-codes.ts --expires 30

# Generate codes with a custom prefix
npx tsx scripts/generate-invite-codes.ts --count 3 --prefix BETA

# Show help
npx tsx scripts/generate-invite-codes.ts --help
```

### 4. Testing the System

1. Start your development server: `npm run dev`
2. Navigate to the signup page
3. Try to sign up without an invite code → Should show validation error
4. Try to sign up with an invalid code → Should show "Invalid invite code"
5. Try to sign up with a valid code → Should succeed and create account

## How It Works

### Database Schema

**invite_codes table:**
- `id`: Unique identifier
- `code`: The invite code (unique, uppercase)
- `created_at`: When the code was created
- `expires_at`: Optional expiration date
- `max_uses`: Maximum number of times this code can be used
- `current_uses`: Current number of times used
- `is_active`: Whether the code is active

**invite_code_uses table:**
- Tracks which users have used which codes
- Prevents users from reusing the same code

### Validation Flow

1. User enters email, password, and invite code
2. System validates the invite code:
   - Check if code exists
   - Check if it's active
   - Check if it hasn't expired
   - Check if it has remaining uses
3. If valid, create the user account
4. Mark the code as used and increment usage counter

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Invite codes can only be validated, not directly queried
- Usage tracking prevents code sharing abuse
- Expired and fully-used codes are automatically rejected

## Managing Invite Codes

### Via SQL Editor (Manual)

You can manage codes directly in Supabase SQL Editor:

```sql
-- View all codes
SELECT * FROM invite_codes;

-- View active codes
SELECT * FROM invite_codes WHERE is_active = true;

-- View code usage
SELECT
  ic.code,
  ic.max_uses,
  ic.current_uses,
  COUNT(icu.id) as actual_uses
FROM invite_codes ic
LEFT JOIN invite_code_uses icu ON ic.id = icu.invite_code_id
GROUP BY ic.id;

-- Deactivate a code
UPDATE invite_codes SET is_active = false WHERE code = 'SOMECODE';

-- Delete a code
DELETE FROM invite_codes WHERE code = 'SOMECODE';

-- Create a code manually
INSERT INTO invite_codes (code, max_uses, expires_at)
VALUES ('CUSTOM2024', 5, NOW() + INTERVAL '30 days');
```

### Via Script (Recommended)

Use the generation script as shown in step 3 above.

## Disabling Public Signups (Alternative)

If you prefer to completely disable public signups instead of using invite codes:

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Click on **Email** provider
3. Toggle off **Enable sign-ups**
4. Manually create user accounts via Supabase dashboard

## Troubleshooting

### Error: "Invalid invite code"
- Verify the code exists in the database
- Check if the code is active (`is_active = true`)
- Check if the code hasn't expired
- Check if the code still has remaining uses

### Error: "You have already used this invite code"
- Each user can only use each invite code once
- Generate a new code for this user

### Migration won't run
- Ensure you have proper permissions in Supabase
- Check for syntax errors in the SQL file
- Try running sections of the migration separately

### Can't connect to Supabase from script
- Verify `.env` file exists with correct credentials
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Ensure you're in the project root directory

## Production Deployment

Before deploying to production:

1. ✅ Run the migration on your production database
2. ✅ Generate production invite codes
3. ✅ Test the signup flow
4. ✅ Remove or deactivate the default `WELCOME2024` code
5. ✅ Set up monitoring for code usage

## Future Enhancements

Potential features to add:

- Admin dashboard for managing codes
- Email-based invite system
- Code analytics and usage reports
- Automatic code generation on admin request
- Bulk code generation for events
