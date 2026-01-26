"use client";

import * as React from "react";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.size <= maxSize) {
      onFileSelect?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= maxSize) {
      onFileSelect?.(file);
    }
  };

  return (
    <div
      className={cn(
        "border-input bg-background hover:border-primary/50 relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
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
      <Upload className="text-muted-foreground mb-4 h-10 w-10" />
      <p className="text-muted-foreground text-sm">
        Click to upload or drag and drop
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        PDF, DOCX up to {maxSize / (1024 * 1024)}MB
      </p>
    </div>
  );
}
