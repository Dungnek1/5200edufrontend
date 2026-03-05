"use client";

import { NextIntlClientProvider } from 'next-intl';

interface ProvidersProps {
    children: React.ReactNode;
    messages: any;
}

export function Providers({ children, messages }: ProvidersProps) {
    return (
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}