"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaintRollerIcon } from "lucide-react"
import { Main } from "@/components/main"
import { Profile } from "@/components/profile"
import { PortfolioPreview } from "@/components/portfolio-preview"
import { usePortfolio } from "@/contexts/portfolio-context"

export default function App() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { portfolioData } = usePortfolio()

  const handleBuild = () => {
    // Check if we have at least LeetCode data
    if (!portfolioData.leetcode) {
      alert("Please validate your LeetCode profile first before building the preview.")
      return
    }
    setIsPreviewOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">CrYOPS</h1>
          <Profile />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            <span className="text-primary">Cr</span>eate <span className="text-primary">Y</span>our <span className="text-primary">O</span>wn <span className="text-primary">P</span>ortfolio <span className="text-primary">S</span>ite
          </h2>
          <p className="text-muted-foreground">
            Connect your data, choose a style, and let AI deploy your site to
            GitHub and Vercel.
          </p>
        </div>

        <Main />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleBuild}>
            Build
            <PaintRollerIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Portfolio Preview Modal */}
      <PortfolioPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
