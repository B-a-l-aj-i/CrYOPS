"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface InspirationCardProps {
  title: string
  image: string
  selected?: boolean
  onSelect?: () => void
}

export function InspirationCard({
  title,
  image,
  selected = false,
  onSelect,
}: InspirationCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer overflow-hidden transition-all hover:shadow-md",
        selected && "border-primary border-2"
      )}
      onClick={onSelect}
    >
      <div className="aspect-video w-full bg-muted">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
      </div>
      {selected && (
        <div className="absolute right-2 top-2 rounded-full bg-primary p-1.5">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </Card>
  )
}

