"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputFieldProps {
  label: string
  placeholder: string
  icon: LucideIcon
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function InputField({
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}

