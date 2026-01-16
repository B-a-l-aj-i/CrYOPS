"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useGithubStore, useDeploymentStore } from "@/app/store";
import type { GitHubData } from "@/app/store";

export function DeployButton() {
  const { data: session, status } = useSession();
  const githubData = useGithubStore((state) => state.githubData);
  const { 
    isGithubDeployed,
    repoUrl: savedRepoUrl,
    vercelUrl: savedVercelUrl,
    setGithubDeployed,
    setVercelDeployed,
    clearDeploymentData
  } = useDeploymentStore();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    repoUrl?: string;
    vercelUrl?: string;
  }>({ type: null, message: "" });




  const handleGithubDeploy = useCallback(async () => {
    if (!githubData) {
      setDeployStatus({
        type: "error",
        message: "No GitHub data available. Please build your portfolio first.",
      });
      return;
    }

    if (status !== "authenticated" || !session?.accessToken) {
      setDeployStatus({
        type: "error",
        message: "Please sign in with GitHub to deploy your portfolio.",
      });
      return;
    }

    setIsDeploying(true);
    setDeployStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubData: githubData as GitHubData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save GitHub deployment info
        setGithubDeployed(result.data.repo.html_url);
        
        setDeployStatus({
          type: "success",
          message: "Portfolio successfully deployed to GitHub! Ready for Vercel deployment.",
          repoUrl: result.data.repo.html_url,
        });
      } else {
        setDeployStatus({
          type: "error",
          message: result.error || "Failed to deploy to GitHub",
        });
      }
    } catch (error) {
      console.error("GitHub deployment error:", error);
      setDeployStatus({
        type: "error",
        message: "An error occurred while deploying to GitHub. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  }, [githubData, status, session, setGithubDeployed]);

  const handleVercelDeploy = useCallback(async () => {
    // if (!savedRepoUrl) {
    //   setDeployStatus({
    //     type: "error",
    //     message: "No GitHub repository found. Please deploy to GitHub first.",
    //   });
    //   return;
    // }

    if (!session?.vercelAccessToken) {
      setDeployStatus({
        type: "error",
        message: "Please authenticate with Vercel first.",
      });
      return;
    }

    setIsDeploying(true);
    setDeployStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/deploy-vercel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubRepoUrl: savedRepoUrl,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Vercel deployment info
        setVercelDeployed(result.data.vercelDeployment.url);
        
        setDeployStatus({
          type: "success",
          message: "Portfolio successfully deployed to Vercel! Your site is now live!",
          repoUrl: savedRepoUrl || undefined,
          vercelUrl: result.data.vercelDeployment.url,
        });
      } else {
        setDeployStatus({
          type: "error",
          message: result.error || "Failed to deploy to Vercel",
        });
      }
    } catch (error) {
      console.error("Vercel deployment error:", error);
      setDeployStatus({
        type: "error",
        message: "An error occurred while deploying to Vercel. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  }, [savedRepoUrl, session, setVercelDeployed]);

  const handleVercelConnect = async () => {
    if (!githubData) {
      setDeployStatus({
        type: "error",
        message: "No GitHub data available. Please build your portfolio first.",
      });
      return;
    }

    if (status !== "authenticated" || !session?.accessToken) {
      setDeployStatus({
        type: "error",
        message: "Please sign in with GitHub first before connecting Vercel.",
      });
      return;
    }

    // Mark Vercel auth as pending before redirect
    setVercelAuthPending(true);
    
    // Trigger Vercel OAuth
    signIn("vercel");
  };

  // Handle deployment recovery after Vercel OAuth
  useEffect(() => {
    if (
      isVercelAuthPending && 
      status === "authenticated" && 
      session?.vercelAccessToken && 
      savedRepoUrl
    ) {
      // Clear the pending flag
      setVercelAuthPending(false);
      
      // Auto-trigger Vercel deployment after successful auth
      handleVercelDeploy();
    }
  }, [isVercelAuthPending, status, session, savedRepoUrl, handleVercelDeploy, setVercelAuthPending]);

  // Show saved deployment status if available
  useEffect(() => {
    if ((savedRepoUrl || savedVercelUrl) && !deployStatus.type) {
      if (savedVercelUrl) {
        setDeployStatus({
          type: "success",
          message: "Portfolio deployed to GitHub and Vercel successfully!",
          repoUrl: savedRepoUrl || undefined,
          vercelUrl: savedVercelUrl,
        });
      } else if (savedRepoUrl && isGithubDeployed) {
        setDeployStatus({
          type: "success",
          message: "Portfolio deployed to GitHub! Ready for Vercel deployment.",
          repoUrl: savedRepoUrl || undefined,
        });
      }
    }
  }, [savedRepoUrl, savedVercelUrl, deployStatus.type, isGithubDeployed]);


  return (
    <div className="flex flex-col items-center gap-4 pt-6">
      {deployStatus.type && (
        <div
          className={`w-full max-w-md p-4 rounded-lg border ${
            deployStatus.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-start gap-3">
            {deployStatus.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{deployStatus.message}</p>
              {deployStatus.repoUrl && (
                <a
                  href={deployStatus.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-1 inline-block flex items-center gap-1"
                >
                  <GithubIcon className="h-3 w-3" />
                  View repository →
                </a>
              )}
              {deployStatus.vercelUrl && (
                <a
                  href={deployStatus.vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-1 inline-block flex items-center gap-1 text-blue-600"
                >
                  <ExternalLink className="h-3 w-3" />
                  View live site →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleGithubDeploy}
        disabled={isDeploying || status !== "authenticated" || !githubData}
        className="min-w-[200px]"
        size="lg"
      >
        {isDeploying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <GithubIcon className="h-4 w-4" />
            {isGithubDeployed ? "Redeploy to GitHub" : "Publish to GitHub"}
          </>
        )}
      </Button>

      {isGithubDeployed && !savedVercelUrl && (
        <>
          {!session?.vercelAccessToken ? (
            <Button
              onClick={handleVercelConnect}
              variant="outline"
              className="min-w-[200px]"
              size="lg"
            >
              <ExternalLink className="h-4 w-4" />
              Connect Vercel for Live URL
            </Button>
          ) : (
            <Button
              onClick={handleVercelDeploy}
              variant="outline"
              className="min-w-[200px]"
              size="lg"
            >
              <ExternalLink className="h-4 w-4" />
              Deploy to Vercel
            </Button>
          )}
          
          {!session?.vercelAccessToken && (
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Connect Vercel to get a live URL for your portfolio
            </p>
          )}
        </>
      )}

      {isGithubDeployed && session?.vercelAccessToken && !savedVercelUrl && (
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Click &quot;Deploy to Vercel&quot; to get your live portfolio URL
        </p>
      )}

      {(status !== "authenticated" || !session?.accessToken) && (
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Please sign in with GitHub to deploy your portfolio
        </p>
      )}
      
      {status === "authenticated" && session?.accessToken && !session.vercelAccessToken && (
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Connect Vercel to automatically deploy your portfolio to a live URL
        </p>
      )}

      {deployStatus.type === "success" && (
        <Button
          onClick={clearDeploymentData}
          variant="ghost"
          className="min-w-[200px]"
          size="sm"
        >
          Start New Deployment
        </Button>
      )}
    </div>
  );
}
