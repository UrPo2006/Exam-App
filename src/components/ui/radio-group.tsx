"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
      
        "group/radio-group-item  relative flex  size-5 shrink-0 rounded-full border border-zinc-300 bg-white outline-none transition-all",
    
        "after:absolute after:-inset-x-3 after:-inset-y-2 after:content-['']",
        
        "focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-100",
        
        "disabled:cursor-not-allowed disabled:opacity-50",
        
     
        "data-checked:border-blue-600 data-checked:bg-white",
        
   
        "dark:bg-white dark:border-zinc-700 dark:data-checked:border-blue-600 dark:focus-visible:ring-blue-900",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center rounded-full"
      >
    
        <span className="size-2.5 rounded-full bg-blue-600 transition-transform" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
export { RadioGroup, RadioGroupItem }
