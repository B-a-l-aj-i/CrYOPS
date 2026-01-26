"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspirationCardProps {
  title: string;
  image: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function InspirationCard({
  title,
  image: _image,
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
      <div className="bg-muted aspect-video w-full">
        <div className="from-muted to-muted/50 flex h-full items-center justify-center bg-gradient-to-br">
          <span className="text-muted-foreground text-xs">{title}</span>
        </div>
      </div>
      {selected && (
        <div className="bg-primary absolute top-2 right-2 rounded-full p-1.5">
          <Check className="text-primary-foreground h-4 w-4" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </Card>
  );
}
