"use client";

import * as React from "react";
import { InputField } from "@/components/input-field";
import { Twitter, Instagram, Youtube, BookOpen, Globe } from "lucide-react";
import { useState } from "react";

export function SocialPresence() {
  const [companyMode] = useState(false);

  return (
    <section className="pointer-events-none mb-12 rounded-lg border p-7 opacity-50">
      <h3 className="mb-2 text-xl font-semibold">Social Presence & Blogs</h3>
      <p className="text-muted-foreground mb-6 text-sm">
        Add links to where you are active. Leave empty if not applicable.
      </p>
      <div className="space-y-4">
        <InputField
          label="X (Twitter)"
          placeholder="x.com/username"
          icon={Twitter}
          disabled={true}
        />
        <InputField
          label="Instagram"
          placeholder="instagram.com/user"
          icon={Instagram}
          disabled={true}
        />
        <InputField
          label="YouTube"
          placeholder="youtube.com/@channel"
          icon={Youtube}
          disabled={true}
        />
        <InputField
          label="Medium / Blog"
          placeholder="medium.com/@writer"
          icon={BookOpen}
          disabled={true}
        />
        {companyMode && (
          <InputField
            label="Existing Company Site / Inspiration URL"
            placeholder="https://mycompany.com"
            icon={Globe}
            disabled={true}
          />
        )}
      </div>
    </section>
  );
}
