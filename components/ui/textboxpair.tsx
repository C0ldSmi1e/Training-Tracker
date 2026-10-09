"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TextboxpairProps extends React.HTMLAttributes<HTMLDivElement> {
  onFirstInputChange: (e: string) => void;
  onSecondInputChange: (e: string) => void;
}

const Textboxpair = React.forwardRef<HTMLDivElement, TextboxpairProps>(
  ({ onFirstInputChange, onSecondInputChange, className, ...props }, ref) => {
    const id = React.useId()

    return (
      <div
        ref={ref}
        className={cn("flex items-end gap-3", className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:w-[150px] sm:flex-none">
          <label
            htmlFor={`${id}-oldest`}
            className="text-[13px] text-muted-foreground"
          >
            Oldest round
          </label>
          <Input
            id={`${id}-oldest`}
            type="text"
            inputMode="numeric"
            placeholder="1"
            className="font-mono"
            onChange={(e) => onFirstInputChange(e.target.value)}
          />
        </div>
        <span className="pb-2.5 text-muted-foreground">to</span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:w-[150px] sm:flex-none">
          <label
            htmlFor={`${id}-newest`}
            className="text-[13px] text-muted-foreground"
          >
            Newest round
          </label>
          <Input
            id={`${id}-newest`}
            type="text"
            inputMode="numeric"
            placeholder="Latest"
            className="font-mono"
            onChange={(e) => onSecondInputChange(e.target.value)}
          />
        </div>
      </div>
    )
  }
)
Textboxpair.displayName = "Textboxpair"

export { Textboxpair }
