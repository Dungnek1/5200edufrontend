import { useState, useEffect } from "react";

/**
 * Responsive Design Rules - Breakpoints
 * - Mobile: < 667px (default, no prefix)
 * - Tablet: 667px - 1024px (sm:, md:)
 * - Desktop: > 1024px (lg:, xl:)
 */
const MOBILE_BREAKPOINT = 667;
const TABLET_BREAKPOINT = 1024;

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: "MOBILE" | "TABLET" | "DESKTOP";
}

export const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: "DESKTOP",
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const isMobileUA =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isTabletUA = /iPad/i.test(userAgent);

      const isMobileWidth = width < MOBILE_BREAKPOINT;
      const isTabletWidth =
        width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;

      const isMobile = isMobileWidth || (isMobileUA && !isTabletUA);
      const isTablet = isTabletWidth || isTabletUA;
      const isDesktop = width >= TABLET_BREAKPOINT && !isMobileUA && !isTabletUA;

      let sessionDeviceType: "MOBILE" | "TABLET" | "DESKTOP";
      if (isMobileWidth || isMobileUA) {
        sessionDeviceType = "MOBILE";
      } else if (isTabletWidth || isTabletUA) {
        sessionDeviceType = "TABLET";
      } else {
        sessionDeviceType = "DESKTOP";
      }

      const newDeviceInfo = {
        isMobile: isMobileWidth,
        isTablet: isTabletWidth,
        isDesktop: width >= TABLET_BREAKPOINT,
        deviceType: sessionDeviceType,
      };

      setDeviceInfo((prev) => {
        if (
          prev.isMobile === newDeviceInfo.isMobile &&
          prev.isTablet === newDeviceInfo.isTablet &&
          prev.isDesktop === newDeviceInfo.isDesktop &&
          prev.deviceType === newDeviceInfo.deviceType
        ) {
          return prev; // No change, return previous state to prevent re-render
        }
        return newDeviceInfo;
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceInfo;
};
