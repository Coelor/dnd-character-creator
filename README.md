# D&D Character Creator

A modern web application for creating and managing D&D 5e characters with a guided, multi-step creation process.

## Overview

This application provides a comprehensive character creation experience for D&D 5e, featuring secure user authentication, real-time data persistence, and an intuitive dashboard for character management.

**Key Technologies:**
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router
* **Backend**: Supabase (PostgreSQL + Auth + Real-time)
* **Hosting**: Deployment-flexible (Vercel, Netlify, etc.)

**User Features:**
* Secure user authentication and account management
* Step-by-step character creation wizard
* Character data persistence with user isolation
* Responsive dashboard for character management

## Features

### Implemented

* **Authentication**: Supabase Auth with email/password authentication
* **Database**: PostgreSQL with Row Level Security for data isolation
* **Multi-step Character Creation**:
  * Basics (name, alignment, HP, AC, initiative)
  * Race selection with ability bonuses
  * Class selection with subclass options
  * Abilities entry (Randomizer | Standard Array | Manual)
  * Background selection with trait picker (personality, ideals, bonds, flaws)
  * Review & Save
* **Data Management**: JSON fields for complex D&D data structures with snake_case naming

### Planned Features

* Custom races and classes management
* Campaign and session management
* Character sheet PDF export
* Real-time collaboration features
* Custom avatar uploads
* Automated level-up mechanics
* Comprehensive testing suite

## Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, Redux Toolkit
* **Backend**: Supabase (PostgreSQL, Auth, Real-time)
* **Security**: Row Level Security, JWT authentication
* **Deployment**: Framework-agnostic, can deploy anywhere

## Setup & Installation

### Prerequisites

* Node.js (>=18)
* Supabase account

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd dnd-character-creator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Environment Variables

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

The application requires a Supabase project with the following database schema. Run the SQL commands in your Supabase SQL Editor to set up the required tables and security policies.

See `docs/ARCHITECTURE.md` for detailed database schema information.

## Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run lint` - Run ESLint

## Documentation

For detailed technical documentation, see the `docs/` folder:

* **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture and system design
* **[TODO](docs/TODO.md)** - Project roadmap and task tracking

## Security

* All user data is protected by Row Level Security policies
* Environment variables protect sensitive configuration
* No sensitive data is exposed in client-side code
* Comprehensive .gitignore prevents credential leaks

## License

Licensed under the MIT License. See [LICENSE](LICENSE).