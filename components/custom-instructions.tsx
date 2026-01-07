import { Textarea } from "@/components/ui/textarea"

export function CustomInstructions() {
  return (
    <section className="mb-12 border rounded-lg p-7 opacity-50 pointer-events-none">
      <h3 className="mb-2 text-xl font-semibold">Custom Instructions</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Tell the AI about your vibe, specific sections you need, or color
        preferences.
      </p>
      <Textarea
        disabled={true}
        placeholder="I want a professional yet friendly tone. Please include a section for my open source contributions and highlight my experience with React and Node.js. Use a teal accent color."
        className="min-h-[120px]"
        defaultValue="I want a professional yet friendly tone. Please include a section for my open source contributions and highlight my experience with React and Node.js. Use a teal accent color."
      />
    </section>
  )
}

