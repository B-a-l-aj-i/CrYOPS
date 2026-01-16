import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { Vercel } from '@vercel/sdk';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.vercelAccessToken) {
      return Response.json(
        {
          success: false,
          error: "Not authenticated with Vercel or missing Vercel access token",
        },
        { status: 401 }
      );
    }

    // Get GitHub repo URL from request body
    const body = await request.json();
    const { githubRepoUrl } = body;

    if (!githubRepoUrl) {
      return Response.json(
        {
          success: false,
          error: "GitHub repository URL is required",
        },
        { status: 400 }
      );
    }

    // Parse GitHub URL to extract owner and repo name
    const githubUrlMatch = githubRepoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!githubUrlMatch) {
      return Response.json(
        {
          success: false,
          error: "Invalid GitHub repository URL format",
        },
        { status: 400 }
      );
    }

    const [, owner, repoName] = githubUrlMatch;

    const vercel = new Vercel({
      bearerToken: "oS20WsSUWwkmrbNtB1G12USE",
    });

    try {
      // Create a new deployment
      const createResponse = await vercel.deployments.createDeployment({
        requestBody: {
          name: `${owner}`,
          target: 'production',
          gitSource: {
            type: 'github',
            org: owner,
            repo: repoName,
            ref: 'main',
          },
          projectSettings: {
            framework: 'vite',
            rootDirectory: null,
            installCommand: 'pnpm install',
            buildCommand: 'pnpm run build',
            outputDirectory: 'dist',
          },
        },
      });

      console.log(`Vercel deployment created: ID ${createResponse.id} and status ${createResponse.status}`);

      // Return successful response
      return Response.json({
        success: true,
        data: {
          vercelDeployment: {
            id: createResponse.id,
            url: createResponse.url,
            status: createResponse.status,
          },
        },
      });

    } catch (deploymentError) {
      console.error(
        deploymentError instanceof Error ? `Deployment Error: ${deploymentError.message}` : String(deploymentError)
      );
      return Response.json({
        success: false,
        error: deploymentError instanceof Error ? deploymentError.message : "Failed to deploy to Vercel",
      },
      { status: 500 }
      );
    }

  } catch (error) {
    console.error("Vercel deployment error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to deploy to Vercel",
      },
      { status: 500 }
    );
  }
}