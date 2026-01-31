/**
 * Component Registry
 * Defines all available content blocks that can be placed on the canvas
 */

import type {
  ComponentRegistryEntry,
  ContentBlockType,
} from "@/types/generator";

// Registry of all available content block components
export const componentRegistry: Record<
  ContentBlockType,
  ComponentRegistryEntry
> = {
  PortfolioHero: {
    id: "PortfolioHero",
    name: "Portfolio Hero",
    description: "Hero section with name, avatar, and bio",
    category: "header",
    dataSource: "github",
    defaultSize: { width: 800, height: 400 },
    minSize: { width: 400, height: 300 },
    resizable: true,
    templatePath: "templates/components/PortfolioHero.tsx",
  },

  GitHubStats: {
    id: "GitHubStats",
    name: "GitHub Statistics",
    description: "Comprehensive GitHub stats and metrics",
    category: "stats",
    dataSource: "github",
    defaultSize: { width: 900, height: 800 },
    minSize: { width: 600, height: 500 },
    resizable: true,
    templatePath: "templates/components/GitHubStats.tsx",
  },

  AboutSection: {
    id: "AboutSection",
    name: "About Section",
    description: "Personal bio and social links",
    category: "personal",
    dataSource: "github",
    defaultSize: { width: 600, height: 300 },
    minSize: { width: 400, height: 200 },
    resizable: true,
    templatePath: "templates/components/AboutSection.tsx",
  },

  // Future components (placeholders for Phase 2+)
  LeetCodeStats: {
    id: "LeetCodeStats",
    name: "LeetCode Progress",
    description: "LeetCode problems solved and rankings",
    category: "stats",
    dataSource: "leetcode",
    defaultSize: { width: 400, height: 500 },
    minSize: { width: 300, height: 400 },
    resizable: true,
    templatePath: "templates/components/LeetCodeStats.tsx",
  },

  ResumeSection: {
    id: "ResumeSection",
    name: "Resume",
    description: "Resume and work experience",
    category: "content",
    dataSource: "resume",
    defaultSize: { width: 700, height: 900 },
    minSize: { width: 500, height: 600 },
    resizable: true,
    templatePath: "templates/components/ResumeSection.tsx",
  },

  BlogSection: {
    id: "BlogSection",
    name: "Blog Posts",
    description: "Recent blog posts and articles",
    category: "content",
    dataSource: "blog",
    defaultSize: { width: 600, height: 700 },
    minSize: { width: 400, height: 500 },
    resizable: true,
    templatePath: "templates/components/BlogSection.tsx",
  },
};

// Helper function to get registry entry by type
export function getComponentRegistry(
  type: ContentBlockType
): ComponentRegistryEntry {
  const entry = componentRegistry[type];
  if (!entry) {
    throw new Error(`Component type "${type}" not found in registry`);
  }
  return entry;
}

// Get all components for a specific data source
export function getComponentsByDataSource(
  source: ComponentRegistryEntry["dataSource"]
): ComponentRegistryEntry[] {
  return Object.values(componentRegistry).filter(
    (entry) => entry.dataSource === source
  );
}

// Get all available component types
export function getAllComponentTypes(): ContentBlockType[] {
  return Object.keys(componentRegistry) as ContentBlockType[];
}
