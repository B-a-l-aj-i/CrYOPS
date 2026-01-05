"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type SelectedElement = "profile" | "leetcode" | "github" | "techStack" | "recentActivity" | null

interface CardLayout {
  x: number
  y: number
  width: number
  height: number
}

interface PropertiesPanelProps {
  selectedElement: SelectedElement
  profile: {
    name: string
    description: string
    image: string | null
    githubUrl: string
    leetcodeUrl: string
    linkedinUrl: string
  }
  onProfileUpdate: (updates: Partial<PropertiesPanelProps["profile"]>) => void
  layout: CardLayout | null
  onLayoutUpdate: (layout: Partial<CardLayout>) => void
}

export function PropertiesPanel({
  selectedElement,
  profile,
  onProfileUpdate,
  layout,
  onLayoutUpdate,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Select an element to edit its properties
      </div>
    )
  }

  const cardName = selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)

  return (
    <div className="space-y-4 overflow-auto p-4">
      <h3 className="font-semibold">{cardName} Properties</h3>

      {/* Layout Controls - Always shown */}
      {layout && (
        <div className="space-y-4 border-b pb-4">
          <h4 className="text-sm font-medium text-muted-foreground">Layout</h4>
          
          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="layout-x" className="text-xs">X Position</Label>
              <Input
                id="layout-x"
                type="number"
                value={Math.round(layout.x)}
                onChange={(e) => onLayoutUpdate({ x: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="layout-y" className="text-xs">Y Position</Label>
              <Input
                id="layout-y"
                type="number"
                value={Math.round(layout.y)}
                onChange={(e) => onLayoutUpdate({ y: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="layout-width" className="text-xs">Width</Label>
              <Input
                id="layout-width"
                type="number"
                value={Math.round(layout.width)}
                onChange={(e) => onLayoutUpdate({ width: parseInt(e.target.value) || 200 })}
                className="h-8 text-xs"
                min={200}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="layout-height" className="text-xs">Height</Label>
              <Input
                id="layout-height"
                type="number"
                value={Math.round(layout.height)}
                onChange={(e) => onLayoutUpdate({ height: parseInt(e.target.value) || 150 })}
                className="h-8 text-xs"
                min={150}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Properties - Only for profile */}
      {selectedElement === "profile" && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Content</h4>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-xs">Name</Label>
            <Input
              id="profile-name"
              value={profile.name}
              onChange={(e) => onProfileUpdate({ name: e.target.value })}
              placeholder="Your Name"
              className="h-8 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="profile-description" className="text-xs">Description</Label>
            <Textarea
              id="profile-description"
              value={profile.description}
              onChange={(e) => onProfileUpdate({ description: e.target.value })}
              placeholder="Your description"
              rows={3}
              className="text-sm"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="profile-github" className="text-xs">GitHub URL</Label>
            <Input
              id="profile-github"
              value={profile.githubUrl}
              onChange={(e) => onProfileUpdate({ githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="h-8 text-sm"
            />
          </div>

          {/* LeetCode URL */}
          <div className="space-y-2">
            <Label htmlFor="profile-leetcode" className="text-xs">LeetCode URL</Label>
            <Input
              id="profile-leetcode"
              value={profile.leetcodeUrl}
              onChange={(e) => onProfileUpdate({ leetcodeUrl: e.target.value })}
              placeholder="https://leetcode.com/username"
              className="h-8 text-sm"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <Label htmlFor="profile-linkedin" className="text-xs">LinkedIn URL</Label>
            <Input
              id="profile-linkedin"
              value={profile.linkedinUrl}
              onChange={(e) => onProfileUpdate({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* Other card types */}
      {selectedElement === "leetcode" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            LeetCode data is automatically fetched from your profile. Drag and resize
            the card to position it.
          </div>
        </div>
      )}

      {selectedElement === "github" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            GitHub card is a placeholder. Drag and resize to position it.
          </div>
        </div>
      )}

      {selectedElement === "techStack" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Tech stack card. Drag and resize to position it.
          </div>
        </div>
      )}

      {selectedElement === "recentActivity" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Recent activity card. Drag and resize to position it.
          </div>
        </div>
      )}
    </div>
  )
}

