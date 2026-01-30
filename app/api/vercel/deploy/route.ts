import { NextRequest } from "next/server";
import { Vercel } from "@vercel/sdk";
import { auth } from "@/lib/auth";
import { vercelDeploySchema } from "@/lib/validations/vercel";

/**
 * Gets a user-friendly error message from an error
 */
function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const status = (error as { status?: number }).status;

    if (
      status === 401 ||
      status === 403 ||
      message.includes("unauthorized") ||
      message.includes("forbidden")
    ) {
      return "Invalid Vercel token. Please check your token and try again.";
    }

    if (
      message.includes("already exists") ||
      message.includes("duplicate") ||
      message.includes("conflict")
    ) {
      return "A project with this name already exists. Please use a different repository or delete the existing project.";
    }

    if (message.includes("not found") || message.includes("404")) {
      return "Repository not found. Please check that the GitHub repository exists and is accessible.";
    }

    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("connection")
    ) {
      return "Network error. Please check your connection and try again.";
    }

    if (message.includes("invalid") || message.includes("bad request")) {
      return "Invalid request. Please check your repository URL and try again.";
    }
  }

  return "An error occurred while deploying to Vercel. Please try again.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validation = vercelDeploySchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { githubRepoUrl, vercelPat } = validation.data;

    const session = await auth();

    if (!session?.accessToken) {
      return Response.json(
        {
          success: false,
          error: "Not authenticated or missing GitHub access token",
        },
        { status: 401 }
      );
    }

    // Parse GitHub URL to extract owner and repo name
    const githubUrlMatch = githubRepoUrl.match(
      /github\.com\/([^\/]+)\/([^\/\?#]+)/
    );
    if (!githubUrlMatch) {
      return Response.json(
        {
          success: false,
          error:
            "Invalid GitHub repository URL format. Expected format: github.com/owner/repo",
        },
        { status: 400 }
      );
    }

    const [, owner, repoName] = githubUrlMatch;

    const projectName = owner.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Initialize Vercel client with user's PAT directly
    const vercel = new Vercel({
      bearerToken: vercelPat,
    });

    try {
      // Step 1: Create Vercel project linked to GitHub repo
      const project = await vercel.projects.createProject({
        requestBody: {
          name: projectName,
          framework: "vite",
          gitRepository: {
            repo: `${owner}/${repoName}`,
            type: "github",
          },
          buildCommand: "npm run build",
          installCommand: "npm install",
          outputDirectory: "dist",
        },
      });

      console.log(
        `Vercel project created: ${project.id} for ${owner}/${repoName}`
      );

      // Step 2: Create deployment
      const deployment = await vercel.deployments.createDeployment({
        requestBody: {
          name: projectName,
          project: project.id,
          target: "production",
          gitSource: {
            type: "github",
            org: owner,
            repo: `${repoName}`,
            ref: "main",
          },
        },
      });

      console.log(
        `Vercel deployment created: ${deployment.id} for project ${project.id}`
      );

      // Step 3: Return success response with public URLs
      return Response.json({
        success: true,
        data: {
          vercelDeployment: {
            url: deployment.url ? `https://${deployment.url}` : null,
            dashboardUrl: `https://vercel.com/${deployment.creator.username}/${project.name}/deployments/${deployment.id}`,
            projectId: project.id,
            deploymentId: deployment.id,
            status: deployment.status, // INITIALIZING | BUILDING | READY | ERROR
          },
          message: `Successfully triggered deployment for ${owner}/${repoName} on Vercel`,
        },
      });
    } catch (deploymentError) {
      // Log detailed error for debugging
      console.error("[Vercel Deploy] Deployment error:", {
        error: deploymentError,
        message:
          deploymentError instanceof Error
            ? deploymentError.message
            : String(deploymentError),
        stack:
          deploymentError instanceof Error ? deploymentError.stack : undefined,
        status: (deploymentError as { status?: number }).status,
        projectName,
        owner,
        repoName,
        githubRepoUrl,
        timestamp: new Date().toISOString(),
      });

      // Return user-friendly error message
      const userMessage = getUserFriendlyError(deploymentError);
      const status = (deploymentError as { status?: number }).status || 500;

      return Response.json(
        {
          success: false,
          error: userMessage,
        },
        { status }
      );
    }
  } catch (error) {
    // Log detailed error for debugging
    console.error("[Vercel Deploy] API error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return user-friendly error message
    const userMessage = getUserFriendlyError(error);
    const status = (error as { status?: number }).status || 500;

    return Response.json(
      {
        success: false,
        error: userMessage,
      },
      { status }
    );
  }
}
