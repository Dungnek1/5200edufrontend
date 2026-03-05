
# 🎓 5200Edu Frontend

> Frontend application for the **5200Edu online learning platform**, built with the latest **Next.js App Router**. 
> The project supports Student/Teacher workflows, authentication, multilingual content, and high-quality video streaming.

---

## 🚀 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI:** React 19 + TypeScript
* **Styling:** Tailwind CSS 4
* **Component Library:** shadcn/ui (Radix UI)
* **Authentication:** NextAuth (JWT + Google OAuth)
* **HTTP Client:** Axios (Custom wrapper + interceptors)
* **Internationalization:** next-intl
* **Forms:** React Hook Form
* **Video Streaming:** HLS.js
* **State Management:** React Context

---

## 📂 Project Structure

```text
5200edu-fe/
│
├── app/                  # Next.js App Router
│   ├── [locale]/         # i18n routing (vi, en)
│   │   ├── (guest)/      # Public pages
│   │   ├── student/      # Student dashboard
│   │   └── teacher/      # Teacher dashboard
│   ├── api/              # Route handlers
│   ├── layout.tsx        # Root layout + providers
│   ├── sitemap.ts        # SEO sitemap
│   └── robots.ts         # robots.txt
│
├── components/           # UI components
│   ├── home/
│   ├── courses/
│   ├── student/
│   ├── teacher/
│   ├── video/
│   ├── forms/
│   ├── modals/
│   ├── shared/
│   └── ui/               # shadcn primitives
│
├── services/             # API services
│   ├── http/             # Axios instance + interceptors
│   └── apis/             # Service modules
│
├── hooks/                # Custom React hooks
│   ├── useAuth
│   ├── useApi
│   ├── useDebounce
│   ├── useLocalStorage
│   └── useWindowSize
│
├── lib/                  # Utilities
│   ├── seo
│   ├── routing
│   ├── validations
│   └── utils
│
├── messages/             # i18n translations
│   ├── en.json
│   └── vi.json
│
├── config/               # External configs
│   └── minio.config.ts
│
└── public/               # Static assets
✨ Key Features
🔐 Authentication
Email/password authentication.

Google OAuth login integration.

JWT access & refresh token flow.

Automatic token refresh via Axios interceptors.

Protected routes designed for specific Student / Teacher roles.

🌍 Internationalization
Supports Vietnamese (vi) and English (en).

Locale-based routing (/vi, /en).

Implemented seamlessly with next-intl.

Example:

TypeScript
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('home');
  return <h1>{t('heroTitle')}</h1>;
}
🎥 Video Streaming
Course videos utilize HLS streaming for efficient, adaptive playback.

Video upload system with media stored in MinIO.

HLS playback implemented using HLS.js.

Main files: * components/video/video-upload-section.tsx

components/video/video-hls-player.tsx

config/minio.config.ts

🔌 API Integration
All API calls pass through a robust service layer.

Axios instance with interceptors for automatic token refresh.

Centralized error handling.

Type-safe service wrappers.

Example:

TypeScript
import { authService } from '@/services/apis';

const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
⚙️ Getting Started
1. Environment Variables
Create a .env.local file in the root directory and add the following variables:

Đoạn mã
NEXT_PUBLIC_API_URL=http://localhost:7000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:5005

NEXTAUTH_URL=http://localhost:5005
NEXTAUTH_SECRET=your-secret-key

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

NEXT_PUBLIC_MINIO=http://localhost:7099
Note: .env* files are ignored by Git. Do not commit sensitive data.

2. Development
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open http://localhost:5005 in your browser to see the result.

3. Production Build
Build the project for production:

Bash
npm run build
Start the production server:

Bash
npm start
👨‍💻 Code Guidelines
TypeScript: Strict mode is enabled and must be adhered to.

Imports: Use the @/ path alias instead of relative imports.

Styling: Prefer Tailwind utility classes.

Network: All API calls must go through services/apis.

Architecture: Keep components modular, maintainable, and focused on a single responsibility.

📝 Notes
This project architecture focuses strictly on modularity and scalability.

Designed for real-world production workflows, accommodating authentication, streaming media, and multi-language support.
