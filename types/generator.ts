/**
 * Types for the dynamic code generation system
 * Phase 1: Layout-aware component generation
 */

import type { GithubPublishData } from "@/lib/validations/github";

// Content block types supported in the system
export type ContentBlockType =
  | "PortfolioHero"
  | "GitHubStats"
  | "AboutSection"
  | "LeetCodeStats"
  | "ResumeSection"
  | "BlogSection";

// Data source types
export type DataSourceType = "github" | "leetcode" | "resume" | "blog";

// Position on canvas (absolute coordinates)
export interface Position {
  x: number;
  y: number;
}

// Size dimensions
export interface Size {
  width: number;
  height: number;
}

// A component instance on the canvas
export interface CanvasComponent {
  id: string; // Unique identifier
  type: ContentBlockType; // Component type from registry
  position: Position; // Absolute position (x, y)
  size: Size; // Dimensions (width, height)
  dataSource: DataSourceType; // Which data source this uses
  zIndex: number; // Stacking order
  props?: Record<string, unknown>; // Additional custom props
}

// The complete canvas state
export interface CanvasState {
  components: CanvasComponent[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  version: number;
}

// Data context - all fetched data sources
export interface DataContext {
  github?: GithubPublishData;
  leetcode?: unknown; // Will be typed when implemented
  resume?: unknown; // Will be typed when implemented
  blog?: unknown; // Will be typed when implemented
}

// Component metadata in registry
export interface ComponentMetadata {
  id: ContentBlockType;
  name: string;
  description: string;
  category: "header" | "content" | "stats" | "personal";
  dataSource: DataSourceType;
  defaultSize: Size;
  minSize?: Size;
  maxSize?: Size;
  resizable: boolean;
}

// Registry entry combining metadata with template info
export interface ComponentRegistryEntry extends ComponentMetadata {
  templatePath: string; // Path to the .tsx template file
}

// Output file structure
export interface GeneratedFile {
  path: string;
  content: string;
}

// Generator options
export interface GeneratorOptions {
  username: string;
  projectName?: string;
  includeMobileVersion?: boolean;
  theme?: "default" | "dark" | "minimal";
}

// Complete generation result
export interface GenerationResult {
  files: GeneratedFile[];
  metadata: {
    componentCount: number;
    generatedAt: string;
    canvasBounds: CanvasState["bounds"];
  };
}
