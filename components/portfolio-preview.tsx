"use client"

import { useState } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Modal } from "@/components/ui/modal"
import { ProfileHeader } from "@/components/preview/profile-header"
import { LeetCodeStatsCard } from "@/components/preview/leetcode-stats-card"
import { GitHubPlaceholderCard } from "@/components/preview/github-placeholder-card"
import { PropertiesPanel } from "@/components/preview/properties-panel"
import { DraggableCard } from "@/components/preview/draggable-card"
import { usePortfolio } from "@/contexts/portfolio-context"

interface PortfolioPreviewProps {
  isOpen: boolean
  onClose: () => void
}

type SelectedElement = "profile" | "leetcode" | "github" | "techStack" | "recentActivity" | null

export function PortfolioPreview({ isOpen, onClose }: PortfolioPreviewProps) {
  const { portfolioData, updateProfile, updateLayout } = usePortfolio()
  const [selectedElement, setSelectedElement] = useState<SelectedElement>(null)

  const handleProfileUpdate = (updates: Partial<typeof portfolioData.profile>) => {
    updateProfile(updates)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const cardId = active.id as SelectedElement
    
    if (cardId && delta && (delta.x !== 0 || delta.y !== 0)) {
      const currentLayout = portfolioData.layouts[cardId as keyof typeof portfolioData.layouts]
      updateLayout(cardId as keyof typeof portfolioData.layouts, {
        x: Math.max(0, currentLayout.x + delta.x),
        y: Math.max(0, currentLayout.y + delta.y),
      })
    }
  }

  const handlePositionChange = (cardId: SelectedElement, x: number, y: number) => {
    if (cardId) {
      updateLayout(cardId as keyof typeof portfolioData.layouts, { x, y })
    }
  }

  const handleSizeChange = (cardId: SelectedElement, width: number, height: number) => {
    if (cardId) {
      updateLayout(cardId as keyof typeof portfolioData.layouts, { width, height })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Portfolio Preview - Edit Mode">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex h-full">
          {/* Center Panel - Canvas */}
          <div
            className="relative flex-1 overflow-auto bg-gray-50"
            onClick={() => setSelectedElement(null)}
            style={{ minHeight: "2000px" }}
          >
            {/* Profile Header Card */}
            <DraggableCard
              id="profile"
              isSelected={selectedElement === "profile"}
              onSelect={() => setSelectedElement("profile")}
              position={portfolioData.layouts.profile}
              size={portfolioData.layouts.profile}
              onPositionChange={(x, y) => handlePositionChange("profile", x, y)}
              onSizeChange={(w, h) => handleSizeChange("profile", w, h)}
              minWidth={400}
              minHeight={150}
              resizable={true}
            >
              <ProfileHeader
                profile={portfolioData.profile}
                isSelected={false}
                onClick={() => {}}
              />
            </DraggableCard>

            {/* LeetCode Stats Card */}
            {portfolioData.leetcode && (
              <DraggableCard
                id="leetcode"
                isSelected={selectedElement === "leetcode"}
                onSelect={() => setSelectedElement("leetcode")}
                position={portfolioData.layouts.leetcode}
                size={portfolioData.layouts.leetcode}
                onPositionChange={(x, y) => handlePositionChange("leetcode", x, y)}
                onSizeChange={(w, h) => handleSizeChange("leetcode", w, h)}
                minWidth={400}
                minHeight={400}
                resizable={true}
              >
              <LeetCodeStatsCard
                data={portfolioData.leetcode}
                isSelected={false}
                onClick={() => {}}
              />
            </DraggableCard>
            )}

            {/* GitHub Card */}
            <DraggableCard
              id="github"
              isSelected={selectedElement === "github"}
              onSelect={() => setSelectedElement("github")}
              position={portfolioData.layouts.github}
              size={portfolioData.layouts.github}
              onPositionChange={(x, y) => handlePositionChange("github", x, y)}
              onSizeChange={(w, h) => handleSizeChange("github", w, h)}
              minWidth={400}
              minHeight={400}
              resizable={true}
            >
              <GitHubPlaceholderCard />
            </DraggableCard>

            {/* Tech Stack Card */}
            <DraggableCard
              id="techStack"
              isSelected={selectedElement === "techStack"}
              onSelect={() => setSelectedElement("techStack")}
              position={portfolioData.layouts.techStack}
              size={portfolioData.layouts.techStack}
              onPositionChange={(x, y) => handlePositionChange("techStack", x, y)}
              onSizeChange={(w, h) => handleSizeChange("techStack", w, h)}
              minWidth={300}
              minHeight={150}
              resizable={true}
            >
              <div className="h-full">
                <h3 className="mb-4 text-lg font-semibold">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind", "Docker", "GraphQL", "Python", "Rust"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-muted px-3 py-1 text-sm"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </DraggableCard>

            {/* Recent Activity Card */}
            <DraggableCard
              id="recentActivity"
              isSelected={selectedElement === "recentActivity"}
              onSelect={() => setSelectedElement("recentActivity")}
              position={portfolioData.layouts.recentActivity}
              size={portfolioData.layouts.recentActivity}
              onPositionChange={(x, y) => handlePositionChange("recentActivity", x, y)}
              onSizeChange={(w, h) => handleSizeChange("recentActivity", w, h)}
              minWidth={300}
              minHeight={200}
              resizable={true}
            >
              <div className="h-full">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Pushed 3 commits to portfolio-v2</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      Solved Median of Two Sorted Arrays (Hard)
                    </div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Starred shadcn/ui on GitHub</div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                </div>
              </div>
            </DraggableCard>
          </div>

          {/* Right Panel - Properties */}
          <div className="w-80 border-l bg-background">
            <PropertiesPanel
              selectedElement={selectedElement}
              profile={portfolioData.profile}
              onProfileUpdate={handleProfileUpdate}
              layout={selectedElement ? portfolioData.layouts[selectedElement as keyof typeof portfolioData.layouts] : null}
              onLayoutUpdate={(layout) => {
                if (selectedElement) {
                  updateLayout(selectedElement as keyof typeof portfolioData.layouts, layout)
                }
              }}
            />
          </div>
        </div>
      </DndContext>
    </Modal>
  )
}

