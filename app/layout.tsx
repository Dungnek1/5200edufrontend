import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5005";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '5200 Education - Nền tảng học trực tuyến',
    template: '%s | 5200 Education',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: '/apple-icon.png',
  },
  description: 'Học mọi lúc, mọi nơi với những khóa học chất lượng cao từ các giảng viên hàng đầu',
  keywords: ['học trực tuyến', 'khóa học', 'giáo dục', 'e-learning', '5200 Education'],
  authors: [{ name: '5200 Education Team' }],
  creator: '5200 Education',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    title: '5200 Education - Nền tảng học trực tuyến',
    description: 'Học mọi lúc, mọi nơi với những khóa học chất lượng cao',
    siteName: '5200 Education',
    images: [
      {
        url: `https://minio.5200ai.com/avatars/banner.png`,
        width: 1200,
        height: 630,
        alt: '5200 Education Open Graph Image',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5200 Education - Nền tảng học trực tuyến',
    description: 'Học mọi lúc, mọi nơi với những khóa học chất lượng cao',
    images: [`https://minio.5200ai.com/avatars/banner.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Zalo OA Meta Tags */}
        <meta property="zalo:image" content={`https://minio.5200ai.com/avatars/banner.png`} />
        <meta property="zalo:title" content="5200 Education - Nền tảng học trực tuyến" />
        <meta property="zalo:description" content="Học mọi lúc, mọi nơi với những khóa học chất lượng cao từ các giảng viên hàng đầu" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* <GoogleOAuthProvider clientId={googleClientId}> */}
        <AuthProvider>{children}</AuthProvider>
        {/* </GoogleOAuthProvider> */}
      </body>
    </html>
  );
}
