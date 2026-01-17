import { NextRequest } from "next/server";
import { Vercel } from "@vercel/sdk";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubRepoUrl, vercelPat } = body;

    // Validate inputs
    if (!githubRepoUrl) {
      return Response.json(
        {
          success: false,
          error: "GitHub repository URL is required",
        },
        { status: 400 }
      );
    }
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

    if (!vercelPat) {
      return Response.json(
        {
          success: false,
          error: "Vercel Personal Access Token is required",
        },
        { status: 400 }
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

      console.log(`Vercel deployment created: ${deployment.id}`);

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
      console.error("Vercel deployment error:", deploymentError);

      return Response.json(
        {
          success: false,
          error: "An error occurred while deploying to Vercel. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Vercel API error:", error);

    return Response.json(
      {
        success: false,
        error: "An error occurred while deploying to Vercel. Please try again.",
      },
      { status: 500 }
    );
  }
}
