# 5200edu Frontend

Dự án frontend cho nền tảng học trực tuyến 5200edu.

## Cấu trúc thư mục

```
5200edu-fe/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Routing đa ngôn ngữ (vi, en)
│   ├── (guest)/                  # Public routes
│   ├── student/                  # Student protected routes
│   │   └── settings/             # Modular settings
│   ├── teacher/                  # Teacher protected routes
│   │   └── settings/             # Modular settings
│   ├── layout.tsx                # Root layout với SEO
│   ├── sitemap.ts                # Sitemap tự động
│   └── robots.ts                 # Robots.txt
├── components/                   # 113+ React components
│   ├── home/                     # Landing page
│   ├── courses/                  # Course components
│   ├── student/                  # Student-specific
│   │   └── settings/             # Modular settings
│   ├── teacher/                  # Teacher-specific
│   │   └── settings/             # Modular settings
│   ├── shared/                   # Reusable components
│   └── ui/                       # Shadcn/ui primitives
├── services/                     # API integration (34 services)
│   ├── http/                     # HTTP client
│   │   ├── index.ts              # Axios instance
│   │   └── service-wrapper.ts    # Generic wrapper
│   └── apis/                     # API endpoints
├── hooks/                        # 9 custom hooks
│   ├── useAuth.ts                # Authentication
│   ├── useApi.ts                 # API calls
│   ├── useDebounce.ts            # Debounce
│   ├── useLocalStorage.ts        # Local storage
│   └── useWindowSize.ts          # Window size
├── lib/                          # Utilities
│   ├── types/                    # TypeScript types
│   ├── validations/              # Zod schemas
│   └── utils/                    # Helper functions
├── messages/                     # i18n translations
│   ├── en.json
│   └── vi.json
└── providers/                    # NextAuth SessionProvider
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Component Library**: Shadcn/ui (Radix UI)
- **Authentication**: NextAuth 4.24
- **HTTP Client**: Axios 1.13.2
- **Internationalization**: next-intl 4.6.1
- **State Management**: React Context + SessionProvider
- **Form Handling**: React Hook Form 7.70.0

## Features

### 🎨 UI/UX
- Shadcn/ui components (Radix UI + Tailwind)
- Responsive design (mobile-first)
- Modular settings architecture
- Dark mode support (sẵn sàng)

### 🔐 Authentication
- JWT token-based authentication
- Auto token refresh on 401
- Protected routes by role
- Email/password + Google OAuth

### 🌐 Internationalization
- Hỗ trợ đa ngôn ngữ (vi, en)
- SEO-friendly URLs
- URL-based locale routing

### 📡 API Integration
- Axios với interceptors
- Auto retry với refresh token
- Service wrapper (type-safe)
- Error handling standardized

### 🔧 Custom Hooks
- `useAuth` - Quản lý authentication
- `useApi` - Gọi API với loading/error states
- `useDebounce` - Debounce input
- `useLocalStorage` - Persist data
- `useWindowSize` - Responsive utilities
- `useClickOutside` - Detect outside clicks

### 🚀 SEO Optimization
- Dynamic metadata
- Sitemap tự động
- Robots.txt
- Open Graph tags
- Twitter Card support

## Installation

```bash
npm install
```

## Environment Variables

Tạo file `.env.local`:

```bash
cp .env.example .env.local
```

Cấu hình:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
REDIS_URL=redis://localhost:6379  # Optional
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Type Checking

```bash
tsc --noEmit
```

## Sử dụng

### Gọi API

```typescript
import { authService } from '@/services/apis';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
```

### Custom Hooks

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

### Modular Settings Components

```typescript
// Student settings
import {
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  SupportSettings
} from '@/components/student/settings';

// Teacher settings
import {
  ProfileSettings,
  SecuritySettings,
  PaymentSettings,
  NotificationSettings
} from '@/components/teacher/settings';
```

### Thêm Shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Code Standards

- **File size limit**: ~650 dòng cho components
- **Naming**: kebab-case cho files, PascalCase cho components
- **TypeScript**: Strict mode, no implicit any
- **Imports**: Sử dụng `@/` alias thay vì relative paths
- **Styling**: Tailwind CSS utilities优先

Chi tiết: [docs/code-standards.md](./docs/code-standards.md)

## Project Documentation

- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [Project Overview](./docs/project-overview-pdr.md)

## Notes

- **Không sử dụng Redux** - State được quản lý bằng React Context
- Shadcn/ui được xây dựng trên Tailwind (không xung đột)
- TypeScript strict mode được bật
- Axios interceptors tự động xử lý token refresh
- SEO metadata được tối ưu cho mọi trang
- Modular settings giúp maintain code dễ dàng hơn

## Recent Updates (2026-01-21)

### Code Cleanup
- ✅ Removed 3000+ lines of unused code
- ✅ Fixed all TypeScript errors
- ✅ Modularized teacher settings (2705 → 4 files)
- ✅ Modularized student settings (2196 → 4 files)
- ✅ Added service wrapper for type-safe API calls
- ✅ Updated type definitions

### File Structure
- ✅ Removed duplicate `components/teachers/` directory
- ✅ Removed unused `lib/mock-data.ts`
- ✅ Removed unused `verify-email/auto` page
- ✅ Organized settings into modular components
