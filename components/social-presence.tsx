"use client"

import * as React from "react"
import { InputField } from "@/components/input-field"
import { Twitter, Instagram, Youtube, BookOpen, Globe } from "lucide-react"

export function SocialPresence() {
  const [companyMode] = React.useState(false)

  return (
    <section className="mb-12 border rounded-lg p-7">
      <h3 className="mb-2 text-xl font-semibold">Social Presence & Blogs</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Add links to where you are active. Leave empty if not applicable.
      </p>
      <div className="space-y-4">
        <InputField
          label="X (Twitter)"
          placeholder="x.com/username"
          icon={Twitter}
        />
        <InputField
          label="Instagram"
          placeholder="instagram.com/user"
          icon={Instagram}
        />
        <InputField
          label="YouTube"
          placeholder="youtube.com/@channel"
          icon={Youtube}
        />
        <InputField
          label="Medium / Blog"
          placeholder="medium.com/@writer"
          icon={BookOpen}
        />
        {companyMode && (
          <InputField
            label="Existing Company Site / Inspiration URL"
            placeholder="https://mycompany.com"
            icon={Globe}
          />
        )}
      </div>
    </section>
  )
}

