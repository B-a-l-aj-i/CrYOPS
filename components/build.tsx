import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Build() {
  return (
    <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline">Save Draft</Button>
          <Button>Build
            <PaintRollerIcon className="h-4 w-4" />
          </Button>
        </div>
  )
}