 "use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LogoSplashLoader from "./logo-splash-loader";

/**
 * PageTransitionLoader Component
 * 
 * Displays a beautiful, minimal loading overlay when navigating between pages.
 * Automatically detects route changes and shows/hides the loader.
 * 
 * Features:
 * - Minimal, elegant design
 * - Smooth fade in/out animations
 * - Logo with subtle bounce animation
 * - Spinner ring for visual feedback
 * - Auto-hides after navigation completes
 * 
 * Usage: Add to your root layout via PageTransitionProvider
 * 
 * @example
 * <PageTransitionProvider />
 */
export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  const prevPathnameRef = useRef<string>(pathname);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef<boolean>(true);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && link.href) {
        if (link.target === '_blank') return;

        if (link.hasAttribute('download')) return;

        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        if (url.pathname !== currentUrl.pathname) {
          setIsLoading(true);
          setDisplayLoader(true);

          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathnameRef.current = pathname;
      setIsLoading(false);
      setDisplayLoader(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (displayLoader) {
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          setDisplayLoader(false);
        }, 200);
      }, 5000); // 5s safety timeout for slow connections

      return () => {
        clearTimeout(safetyTimeout);
      };
    }
  }, [displayLoader]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname && !isInitialMountRef.current) {
      const isAuthPage = (path: string) => /\/(login|register)$/.test(path);
      if (isAuthPage(prevPathnameRef.current) && isAuthPage(pathname)) {
        prevPathnameRef.current = pathname;
        return;
      }

      if (!displayLoader) {
        setIsLoading(true);
        setDisplayLoader(true);
      }
      prevPathnameRef.current = pathname;

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      navigationTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          setDisplayLoader(false);
        }, 200);
      }, 300);

      return () => {
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
      };
    }
  }, [pathname, displayLoader]);

  if (!displayLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"
        }`}
      style={{ pointerEvents: isLoading ? "auto" : "none" }}
      aria-label="Loading page"
      role="status"
    >
      <LogoSplashLoader />
    </div>
  );
}
