"use client"

import * as React from "react"
import { Upload, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.size <= maxSize) {
      onFileSelect?.(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= maxSize) {
      onFileSelect?.(file)
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-8 transition-colors hover:border-primary/50",
        isDragging && "border-primary bg-accent",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Click to upload or drag and drop
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        PDF, DOCX up to {maxSize / (1024 * 1024)}MB
      </p>
    </div>
  )
}

