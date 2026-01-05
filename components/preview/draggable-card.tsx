"use client"

import { useState, useRef, useEffect } from "react"
import { useDraggable } from "@dnd-kit/core"
import { GripVertical, Maximize2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DraggableCardProps {
  id: string
  children: React.ReactNode
  isSelected: boolean
  onSelect: () => void
  position: { x: number; y: number }
  size: { width: number; height: number }
  onPositionChange: (x: number, y: number) => void
  onSizeChange: (width: number, height: number) => void
  minWidth?: number
  minHeight?: number
  resizable?: boolean
}

export function DraggableCard({
  id,
  children,
  isSelected,
  onSelect,
  position,
  size,
  onPositionChange,
  onSizeChange,
  minWidth = 200,
  minHeight = 150,
  resizable = true,
}: DraggableCardProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    disabled: isResizing,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    }
  }

  useEffect(() => {
    if (!isResizing || !resizeHandle || !resizeStartRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current!.x
      const deltaY = e.clientY - resizeStartRef.current!.y

      let newWidth = resizeStartRef.current!.width
      let newHeight = resizeStartRef.current!.height

      if (resizeHandle.includes("right")) {
        newWidth = Math.max(minWidth, resizeStartRef.current!.width + deltaX)
      }
      if (resizeHandle.includes("left")) {
        newWidth = Math.max(minWidth, resizeStartRef.current!.width - deltaX)
      }
      if (resizeHandle.includes("bottom")) {
        newHeight = Math.max(minHeight, resizeStartRef.current!.height + deltaY)
      }
      if (resizeHandle.includes("top")) {
        newHeight = Math.max(minHeight, resizeStartRef.current!.height - deltaY)
      }

      onSizeChange(newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
      resizeStartRef.current = null
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, resizeHandle, minWidth, minHeight, onSizeChange])

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        if (cardRef.current !== node) {
          cardRef.current = node
        }
      }}
      style={{
        ...style,
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className={cn(
        "group",
        isSelected && "z-10",
        !isSelected && "z-0"
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-lg border-2 bg-card transition-all",
          isSelected
            ? "border-primary shadow-lg ring-2 ring-primary/20"
            : "border-transparent hover:border-muted-foreground/50",
          isDragging && "opacity-90"
        )}
      >
        {/* Drag Handle */}
        {isSelected && (
          <div
            {...attributes}
            {...listeners}
            className="absolute -left-3 -top-3 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Resize Handles */}
        {isSelected && resizable && (
          <>
            {/* Corner Handles */}
            <div
              className="absolute -bottom-1 -right-1 h-3 w-3 cursor-nwse-resize rounded-full border-2 border-primary bg-background"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
            />
            <div
              className="absolute -bottom-1 -left-1 h-3 w-3 cursor-nesw-resize rounded-full border-2 border-primary bg-background"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
            />
            <div
              className="absolute -top-1 -right-1 h-3 w-3 cursor-nesw-resize rounded-full border-2 border-primary bg-background"
              onMouseDown={(e) => handleMouseDown(e, "top-right")}
            />
            <div
              className="absolute -top-1 -left-1 h-3 w-3 cursor-nwse-resize rounded-full border-2 border-primary bg-background"
              onMouseDown={(e) => handleMouseDown(e, "top-left")}
            />

            {/* Edge Handles */}
            <div
              className="absolute -left-1 top-1/2 h-8 w-2 -translate-y-1/2 cursor-ew-resize rounded border border-primary bg-background opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleMouseDown(e, "left")}
            />
            <div
              className="absolute -right-1 top-1/2 h-8 w-2 -translate-y-1/2 cursor-ew-resize rounded border border-primary bg-background opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            />
            <div
              className="absolute left-1/2 -top-1 h-2 w-8 -translate-x-1/2 cursor-ns-resize rounded border border-primary bg-background opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleMouseDown(e, "top")}
            />
            <div
              className="absolute left-1/2 -bottom-1 h-2 w-8 -translate-x-1/2 cursor-ns-resize rounded border border-primary bg-background opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleMouseDown(e, "bottom")}
            />
          </>
        )}

        {/* Content */}
        <div className="h-full w-full overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}

