"use client";

import Image from "next/image";

function LogoSplashLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse opacity-20">
          <div className="w-full h-full rounded-full bg-[#4162e7] blur-xl" />
        </div>
        <div
          className="relative animate-bounce"
          style={{ animationDuration: "2s", animationTimingFunction: "ease-in-out" }}
        >
          <Image
            src="/logo/Logo.svg"
            alt="Loading"
            width={80}
            height={80}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>

      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#4162e7]/20" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4162e7] animate-spin"
          style={{ animationDuration: "1s" }}
        />
      </div>
    </div>
  );
}

export default LogoSplashLoader;

