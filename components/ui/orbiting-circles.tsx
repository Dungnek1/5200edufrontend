"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface OrbitingCirclesProps {
  className?: string;
  children?: ReactNode;
  radius?: number;
  duration?: number;
  delay?: number;
  path?: boolean;
  iconSize?: number;
  reverse?: boolean;
  speed?: number;
  initialAngles?: number[]; // Custom initial angles for each child
}

export function OrbitingCircles({
  className,
  children,
  radius = 50,
  duration = 20,
  delay = 0,
  path = false,
  iconSize = 40,
  reverse = false,
  speed = 1,
  initialAngles,
}: OrbitingCirclesProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const angleIncrement = 360 / childrenArray.length;

  return (
    <div
      className={cn("relative flex size-full items-center justify-center", className)}
      style={
        {
          "--radius": radius,
          "--duration": duration / speed,
          "--delay": -delay,
        } as React.CSSProperties
      }
    >
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-border"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4,4"
            strokeWidth={0.5}
          />
        </svg>
      )}
      {childrenArray.map((child, index) => {
        const angle = initialAngles && initialAngles[index] !== undefined
          ? initialAngles[index]
          : (index * angleIncrement + (reverse ? 180 : 0)) % 360;

        const animationDuration = duration / speed;
        
        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 flex items-center justify-center animate-orbit"
            style={{
              "--angle": angle,
              "--radius": radius,
              "--duration": animationDuration,
              animationDelay: delay ? `${delay}s` : undefined,
              width: iconSize > 100 ? "auto" : iconSize,
              height: iconSize > 100 ? "auto" : iconSize,
            } as React.CSSProperties
            }
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
