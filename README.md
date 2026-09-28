# LearnSpace+ by StudyHack

**Responsive Web-Based Learning & Bimbel Management System**
*Developed by Tokofile*

## Stack
- Frontend: React 18
- Build Tool: Vite
- Styling: Tailwind CSS v4, shadcn/ui
- State Management: Zustand (with LocalStorage persistence for demo)

## Requirements
- Node.js 18+
- npm 9+

## Install
```bash
npm install
```

## Environment variables
Copy `.env.example` to `.env` if required by your deployment, though this frontend-only build may not require it directly for static preview.
```bash
cp .env.example .env
```

## Database setup
Currently, the "Lite" version relies on Zustand mock data stored in `localStorage`. 
No external SQL database configuration is needed for the frontend demonstration.

## Development command
```bash
npm run dev
```

## Production build
```bash
npm run build
```
This will generate static files in the `/dist` folder.

## Deployment
Upload the contents of the `/dist` folder to your client-supplied hosting (e.g., cPanel, Vercel, Netlify, or Nginx server).
Ensure that URL rewrites are configured to point to `index.html` for React Router to handle client-side routing.

## Default role/setup
By default, the application runs with mock users. You can switch roles (Admin, Guru, Siswa) from the Login page which sets the appropriate session state.

## Storage permissions
No special file storage permissions are required for the static frontend build.

## Backup recommendation
Since data is stored in LocalStorage for this frontend-only mock, clearing browser data will reset the application to its default seeded state. For a production backend, regular database dumps should be configured.
