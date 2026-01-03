"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, ExternalLink } from "lucide-react"
import { useState } from "react"

interface InspirationSite {
  id: string
  title: string
  description: string
  url: string
  category: string
  image?: string
}

// Sample inspiration sites - in production, this would come from an API
const inspirationSites: InspirationSite[] = [
  {
    id: "1",
    title: "Minimalist Clean",
    description: "Clean, minimal design with focus on typography and whitespace",
    url: "https://example.com/minimalist",
    category: "Minimalist",
  },
  {
    id: "2",
    title: "Bold & Typographic",
    description: "Bold typography with strong visual hierarchy",
    url: "https://example.com/bold",
    category: "Typography",
  },
  {
    id: "3",
    title: "Bento Grid",
    description: "Modern grid-based layout with card components",
    url: "https://example.com/bento",
    category: "Grid",
  },
  {
    id: "4",
    title: "Dev Terminal Dark",
    description: "Dark theme inspired by developer terminals",
    url: "https://example.com/terminal",
    category: "Developer",
  },
  {
    id: "5",
    title: "Creative Portfolio",
    description: "Showcase your creative work with style",
    url: "https://example.com/creative",
    category: "Creative",
  },
  {
    id: "6",
    title: "Professional Corporate",
    description: "Clean, professional design for business portfolios",
    url: "https://example.com/corporate",
    category: "Business",
  },
  {
    id: "7",
    title: "Animated Interactive",
    description: "Interactive portfolio with animations and transitions",
    url: "https://example.com/animated",
    category: "Interactive",
  },
  {
    id: "8",
    title: "Photography Focus",
    description: "Perfect for photographers and visual artists",
    url: "https://example.com/photography",
    category: "Photography",
  },
]

export default function InspirationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(inspirationSites.map((site) => site.category)))

  const filteredSites = inspirationSites.filter((site) => {
    const matchesSearch =
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || site.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            CrYOPS
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Inspiration Sites</h1>
          <p className="text-muted-foreground">
            Browse through curated portfolio inspiration sites from around the web
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search inspirations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Inspiration Grid */}
        {filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <Card
                key={site.id}
                className="group cursor-pointer transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-sm font-medium text-muted-foreground">
                        {site.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{site.title}</CardTitle>
                      <span className="text-xs text-muted-foreground">{site.category}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{site.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Site
                      <ExternalLink className="ml-1 inline h-3 w-3" />
                    </a>
                    <Button size="sm" className="group-hover:bg-primary">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No inspiration sites found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}

