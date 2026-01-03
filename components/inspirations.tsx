import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function SelectInspiration() {
  return (
    <section className="mb-12 border rounded-lg p-7">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-semibold">Selected Inspiration</h3>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t selected any inspiration yet, click to view available inspirations.
          </p>
        </div>
        <Link href="/inspiration">
          <Button variant="outline">
            Browse Inspirations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

