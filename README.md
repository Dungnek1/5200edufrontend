# 5200Edu Frontend

Frontend application for the **5200Edu online learning platform**, built with **Next.js App Router**.  
The project supports **Student/Teacher workflows, authentication, multilingual content, and video streaming**.

---

# Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Component Library:** shadcn/ui (Radix UI)
- **Authentication:** NextAuth (JWT + Google OAuth)
- **HTTP Client:** Axios (custom wrapper + interceptors)
- **Internationalization:** next-intl
- **Forms:** React Hook Form
- **Video Streaming:** HLS.js
- **State Management:** React Context

---

# Project Structure
5200edu-fe/
│
├── app/ # Next.js App Router
│ ├── [locale]/ # i18n routing (vi, en)
│ │ ├── (guest)/ # Public pages
│ │ ├── student/ # Student dashboard
│ │ └── teacher/ # Teacher dashboard
│ ├── api/ # Route handlers
│ ├── layout.tsx # Root layout + providers
│ ├── sitemap.ts # SEO sitemap
│ └── robots.ts # robots.txt
│
├── components/ # UI components
│ ├── home/
│ ├── courses/
│ ├── student/
│ ├── teacher/
│ ├── video/
│ ├── forms/
│ ├── modals/
│ ├── shared/
│ └── ui/ # shadcn primitives
│
├── services/ # API services
│ ├── http/ # Axios instance + interceptors
│ └── apis/ # Service modules
│
├── hooks/ # Custom React hooks
│ ├── useAuth
│ ├── useApi
│ ├── useDebounce
│ ├── useLocalStorage
│ └── useWindowSize
│
├── lib/ # Utilities
│ ├── seo
│ ├── routing
│ ├── validations
│ └── utils
│
├── messages/ # i18n translations
│ ├── en.json
│ └── vi.json
│
├── config/ # External configs
│ └── minio.config.ts
│
└── public/ # Static assets


---

# Key Features

## Authentication

- Email/password authentication
- Google OAuth login
- JWT access & refresh token flow
- Automatic token refresh via **Axios interceptors**
- Protected routes for **Student / Teacher roles**

---

## Internationalization

- Supports **Vietnamese and English**
- Locale-based routing (`/vi`, `/en`)
- Implemented with **next-intl**

Example:

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('home');
return <h1>{t('heroTitle')}</h1>;
Video Streaming

Course videos use HLS streaming for efficient playback.

Video upload system

HLS playback using HLS.js

Media stored in MinIO

Main files:

components/video/video-upload-section.tsx
components/video/video-hls-player.tsx
config/minio.config.ts
API Integration

All API calls go through a service layer.

Features:

Axios instance with interceptors

Automatic token refresh

Centralized error handling

Type-safe service wrappers

Example:

import { authService } from '@/services/apis';

const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
Environment Variables

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:7000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:5005

NEXTAUTH_URL=http://localhost:5005
NEXTAUTH_SECRET=your-secret-key

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

NEXT_PUBLIC_MINIO=http://localhost:7099

.env* files are ignored by Git.

Development

Install dependencies:

npm install

Run development server:

npm run dev

Open:

http://localhost:5005
Production Build

Build the project:

npm run build

Run production server:

npm start
Code Guidelines

TypeScript strict mode

Use @/ path alias instead of relative imports

Prefer Tailwind utility classes

API calls should go through services/apis

Keep components modular and maintainable

Notes

Sensitive data such as .env files are not committed.

Project architecture focuses on modularity and scalability.

Designed for real-world production workflows including authentication, streaming media, and multi-language support.
