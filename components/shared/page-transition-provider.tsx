"use client";

import { PageTransitionLoader } from "./page-transition-loader";

/**
 * PageTransitionProvider
 * 
 * Client component wrapper for PageTransitionLoader
 * Use this in server components/layouts
 */
export function PageTransitionProvider() {
  return <PageTransitionLoader />;
}
