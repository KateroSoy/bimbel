# Project Audit

## Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, shadcn/ui components, CSS modules (index.css)
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand
- **Animations**: motion/react (Framer Motion)
- **Icons**: Lucide React
- **Language**: TypeScript

## Current App Structure
- `/src/pages`: Contains segmented pages for Landing, Login, Admin, Guru (Tutor), and Siswa (Student).
- `/src/components`: UI components, layout components.
- `/src/services`: Likely API integrations (need to verify real backend vs mock).
- `/src/store`: Zustand stores.

## Identifications
- **KEEP**: Routing structure, Zustand state, Tailwind + Shadcn config, basic CRUD pages (to be modified).
- **MODIFY**: 
  - Landing page content & hero to match "LearnSpace+ by StudyHack"
  - Login page branding
  - All Admin, Guru, Siswa dashboards & navs to align with UI prototypes
  - Remove all legacy "SekolahVerse" branding.
- **REMOVE / HIDE**: Advanced reporting, RPP Generator, Advanced Finance, Inventory, WA integration (unless deeply integrated and zero-effort to keep).
- **NOT REQUIRED**: Backend migration (keep existing API/mock approach for now).

## Next Steps
- Verify if the app can run (Phase 1).
- Apply rebranding (Phase 2).
