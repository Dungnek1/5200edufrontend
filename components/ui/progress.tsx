"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value?: number
  }
>(({ className, value = 0, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-[16px] w-full overflow-hidden rounded-full bg-[#DBDDE5]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="relative flex h-full items-center justify-center rounded-full bg-[#0A0BD9] transition-all duration-300 ease-out"
        style={{ width: `${value}%` }}
      >
        {/* Text nằm giữa phần màu xanh */}
        {value > 0 && (
          <span className="px-1 text-[10px] font-semibold text-[#0A0BD9] whitespace-nowrap">
            {value}%
          </span>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = "Progress"

export { Progress }
