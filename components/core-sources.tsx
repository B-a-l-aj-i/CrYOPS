"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Linkedin, Github, Code, Plus, X, Loader2 } from "lucide-react"
import { useState } from "react"

const CODING_PLATFORMS = [
  { value: "leetcode", label: "LeetCode", icon: Code },
  { value: "hackerrank", label: "HackerRank", icon: Code },
  { value: "codeforces", label: "Codeforces", icon: Code },
  { value: "codewars", label: "Codewars", icon: Code },
  { value: "codechef", label: "CodeChef", icon: Code },
  { value: "atcoder", label: "AtCoder", icon: Code },
] as const

interface CodingPlatform {
  id: string
  platform: string
  username: string
}

export function CoreSources() {
  const [codingPlatforms, setCodingPlatforms] = useState<CodingPlatform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [usernameInput, setUsernameInput] = useState<string>("")
  const [extractingPlatform, setExtractingPlatform] = useState<string | null>(null)

  const handleAddPlatform = () => {
    if (!selectedPlatform || !usernameInput.trim()) return

    const newPlatform: CodingPlatform = {
      id: `${selectedPlatform}-${Date.now()}`,
      platform: selectedPlatform,
      username: usernameInput.trim(),
    }

    setCodingPlatforms([...codingPlatforms, newPlatform])
    setSelectedPlatform("")
    setUsernameInput("")
  }

  const handleRemovePlatform = (id: string) => {
    setCodingPlatforms(codingPlatforms.filter((p) => p.id !== id))
  }

  const handleExtractPlatform = async (platform: CodingPlatform) => {
    setExtractingPlatform(platform.id)
    try {
      // TODO: Implement API call to extract platform data
      const response = await fetch("/api/extract-coding-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platform.platform,
          username: platform.username,
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log("Extracted data:", result.data)
        // You can store this data in state or context
      }
    } catch (error) {
      console.error("Extraction failed:", error)
    } finally {
      setExtractingPlatform(null)
    }
  }

  const getPlatformLabel = (platformValue: string) => {
    return CODING_PLATFORMS.find((p) => p.value === platformValue)?.label || platformValue
  }

  return (
    <section className="mb-12 border rounded-lg p-7">
      <h3 className="mb-2 text-xl font-semibold">Core Sources</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        We&apos;ll extract your skills, experience, and projects from these
        sources.
      </p>
      <div className="space-y-4">
        <InputField
          label="LinkedIn Profile"
          placeholder="linkedin.com/in/username"
          icon={Linkedin}
        />
        <InputField
          label="GitHub Profile"
          placeholder="github.com/username"
          icon={Github}
        />

        {/* Coding Platforms Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Coding Platforms</Label>
          
          {/* Add Platform Form */}
          <div className="flex gap-2">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {CODING_PLATFORMS.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative flex-1">
              <Code className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddPlatform()
                  }
                }}
                className="pl-10"
              />
            </div>
            
            <Button
              onClick={handleAddPlatform}
              disabled={!selectedPlatform || !usernameInput.trim()}
              size="icon"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Added Platforms List */}
          {codingPlatforms.length > 0 && (
            <div className="space-y-2">
              {codingPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center gap-2 rounded-lg border p-3 bg-muted/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {getPlatformLabel(platform.platform)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                      {platform.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtractPlatform(platform)}
                      disabled={extractingPlatform === platform.id}
                    >
                      {extractingPlatform === platform.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Extract"
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemovePlatform(platform.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Resume / CV</Label>
          <FileUpload accept=".pdf,.docx" maxSize={10 * 1024 * 1024} />
        </div>
      </div>
    </section>
  )
}

