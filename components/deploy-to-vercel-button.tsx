"use client";

import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDeploymentStore, useVercelTokenStore } from "@/app/store";
import { VercelTokenInput } from "./vercel-token-input";

interface DeployToVercelButtonProps {
  githubRepoUrl: string;
  onDeploymentComplete?: (deployment: any) => void;
}

export function DeployToVercelButton({ githubRepoUrl, onDeploymentComplete }: DeployToVercelButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    vercelUrl?: string;
  }>({ type: null, message: "" });
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  const {
    vercelUrl: savedVercelUrl,
    setVercelDeployed,
  } = useDeploymentStore();

  const {
    vercelToken: storedToken,
  } = useVercelTokenStore();

  const handleVercelDeploy = useCallback(async () => {
    console.log("handleVercelDeploy", githubRepoUrl, storedToken);
    if (!githubRepoUrl) {
      setDeployStatus({
        type: "error",
        message: "No GitHub repository found. Please publish to GitHub first.",
      });
      return;
    }

    if (!storedToken) {
      // Show token input instead
      setShowTokenInput(true);
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
          githubRepoUrl,
          vercelPat: storedToken,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Vercel deployment info
        setVercelDeployed(result.data.vercelDeployment.url);
        
        setDeployStatus({
          type: "success",
          message: result.data.message || "Portfolio successfully deployed to Vercel! Your site is now live!",
          vercelUrl: result.data.vercelDeployment.url,
        });

        // Notify parent component
        if (onDeploymentComplete) {
          onDeploymentComplete(result.data);
        }
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
  }, [githubRepoUrl, storedToken]);

  const handleTokenSet = (token: string) => {
    setShowTokenInput(false);
    // Immediately trigger deployment after token is set
    setTimeout(() => {
      handleVercelDeploy();
    }, 100);
  };

  const handleTokenCancel = () => {
    setShowTokenInput(false);
  };

 return (
    <div className="flex flex-col items-center gap-4">
      {/* Token Input Modal */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Connect Vercel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Vercel Personal Access Token to deploy your portfolio to your Vercel account.
            </p>
            <VercelTokenInput
              onTokenSet={handleTokenSet}
              onCancel={handleTokenCancel}
            />
          </div>
        </div>
      )}

      {/* Deploy Button */}
      {!showTokenInput && (
        <>
          {storedToken && (
            <div className="text-xs text-green-600 text-center mb-2">
              ✓ Vercel token ready
            </div>
          )}

          <Button
            onClick={handleVercelDeploy}
            variant="outline"
            className="cursor-pointer min-w-[200px]"
            size="lg"
            disabled={isDeploying || !githubRepoUrl || !storedToken}
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deploying...
              </>
            ) : !storedToken ? (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Vercel for Live URL
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Deploy to Vercel
              </>
            )}
          </Button>
        </>
      )}

      {/* Instructions when no token */}
      {!storedToken && !showTokenInput && (
        <div className="text-center">
          <Button
            onClick={() => setShowTokenInput(true)}
            variant="outline"
            className="cursor-pointer min-w-[200px]"
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect Vercel for Live URL
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-md mt-2">
            Enter your Vercel Personal Access Token to deploy to your Vercel account
          </p>
        </div>
      )}

      {/* Deployment Status */}
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
    </div>
  );
}