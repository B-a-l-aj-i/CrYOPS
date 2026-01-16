"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDeploymentStore } from "@/app/store";

export function DeployToVercelButton() {
  const { data: session, status } = useSession();
  const { 
    repoUrl, 
    vercelUrl,
    isVercelAuthPending,
    setVercelAuthPending,
    setVercelDeployed,
  } = useDeploymentStore();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    vercelUrl?: string;
  }>({ type: null, message: "" });

  const handleVercelConnect = async () => {
    if (!repoUrl) {
      setDeployStatus({
        type: "error",
        message: "No GitHub repository found. Please publish to GitHub first.",
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

  const handleVercelDeploy = useCallback(async () => {
    if (!repoUrl) {
      setDeployStatus({
        type: "error",
        message: "No GitHub repository found. Please publish to GitHub first.",
      });
      return;
    }

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
          githubRepoUrl: repoUrl,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Vercel deployment info
        setVercelDeployed(result.data.vercelDeployment.url);
        
        setDeployStatus({
          type: "success",
          message: "Portfolio successfully deployed to Vercel! Your site is now live!",
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
  }, [repoUrl, session, setVercelDeployed]);

  // Handle deployment recovery after Vercel OAuth
  useEffect(() => {
    if (
      isVercelAuthPending && 
      status === "authenticated" && 
      session?.vercelAccessToken && 
      repoUrl &&
      !vercelUrl
    ) {
      // Clear the pending flag
      setVercelAuthPending(false);
      
      // Auto-trigger Vercel deployment after successful auth
      handleVercelDeploy();
    }
  }, [isVercelAuthPending, status, session, repoUrl, vercelUrl, handleVercelDeploy, setVercelAuthPending]);

  const shouldShowConnectButton = !session?.vercelAccessToken && !vercelUrl;
  const shouldShowDeployButton = session?.vercelAccessToken && !vercelUrl;
  const vercelButtonDisabled = isDeploying || !repoUrl || !session?.vercelAccessToken;

  return (
    <div className="flex flex-col items-center gap-4">
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

      <div className="text-center space-y-3">
        {shouldShowConnectButton && (
          <Button
            onClick={handleVercelConnect}
            variant="outline"
            className="cursor-pointer min-w-[200px]"
            size="lg"
            disabled={!repoUrl}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect Vercel for Live URL
          </Button>
        )}

        {shouldShowDeployButton && (
          <Button
            onClick={handleVercelDeploy}
            variant="outline"
            className="cursor-pointer min-w-[200px]"
            size="lg"
            disabled={vercelButtonDisabled}
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deploying...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Deploy to Vercel
              </>
            )}
          </Button>
        )}

        {!session?.vercelAccessToken && (
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Connect Vercel to automatically deploy your portfolio to a live URL
          </p>
        )}

        {session?.vercelAccessToken && !vercelUrl && (
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Click &quot;Deploy to Vercel&quot; to get your live portfolio URL
          </p>
        )}
      </div>
    </div>
  );
}