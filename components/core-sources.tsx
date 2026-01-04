"use client"

import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { InputField } from "@/components/input-field"
import { GitHub } from "@/components/github"
import { CodingPlatforms } from "@/components/coding-platforms"
import { Linkedin } from "lucide-react"

export function CoreSources() {

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
        <GitHub />
        <CodingPlatforms />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Resume / CV</Label>
          <FileUpload accept=".pdf,.docx" maxSize={10 * 1024 * 1024} />
        </div>
      </div>
    </section>
  )
}

