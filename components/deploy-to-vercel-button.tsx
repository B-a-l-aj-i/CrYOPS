"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useVercelTokenStore } from "@/app/store";
import { VercelTokenInput } from "./vercel-token-input";
import { useDeployToVercel } from "@/hooks/QueryHooks/useDeployToVercel";
import type { DeployToVercelResponse } from "@/hooks/QueryHooks/useDeployToVercel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";

interface DeployToVercelButtonProps {
  githubRepoUrl: string;
  onDeploymentComplete?: (deployment: DeployToVercelResponse["data"]) => void;
}

export function DeployToVercelButton({
  githubRepoUrl,
  onDeploymentComplete,
}: DeployToVercelButtonProps) {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const { vercelToken: storedToken } = useVercelTokenStore();

  const deployMutation = useDeployToVercel({
    onSuccess: (data) => {
      if (onDeploymentComplete && data.data) {
        onDeploymentComplete(data.data);
      }
    },
    onError: (error) => {
      console.error("Vercel deployment error:", error);
    },
  });

  const handleVercelDeploy = () => {
    if (!githubRepoUrl) {
      return;
    }

    if (!storedToken) {
      // Show token input instead
      setShowTokenInput(true);
      return;
    }

    // Trigger React Query mutation
    deployMutation.mutate({
      githubRepoUrl,
      vercelPat: storedToken,
    });
  };

  const handleTokenSet = () => {
    setShowTokenInput(false);
    if (githubRepoUrl) {
      // Small delay to ensure token is stored
      setTimeout(() => {
        handleVercelDeploy();
      }, 100);
    }
  };

  const handleTokenCancel = () => {
    setShowTokenInput(false);
  };

  // Derive status from React Query mutation state
  const isDeploying = deployMutation.isPending;
  const deployStatus = deployMutation.isSuccess
    ? {
      type: "success" as const,
      message:
        deployMutation.data?.data?.message ||
        "Portfolio successfully deployed to Vercel! Your site is now live!",
      vercelUrl: deployMutation.data?.data?.vercelDeployment.url,
    }
    : deployMutation.isError
      ? {
        type: "error" as const,
        message:
          deployMutation.error?.message ||
          "An error occurred while deploying to Vercel. Please try again.",
        vercelUrl: undefined,
      }
      : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog open={showTokenInput} onOpenChange={setShowTokenInput}>
        {!storedToken && (
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer min-w-[200px]" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Vercel for Live URL
            </Button>
          </DialogTrigger>
        )}
        <DialogContent 
          className="max-w-md bg-white p-6" 
          overlayClassName="bg-black/50 backdrop-blur-sm"
        > 
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold mb-4 text-center">Connect Vercel</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mb-4 text-center">
              Enter your Vercel Personal Access Token to deploy your portfolio to your Vercel account.
            </DialogDescription>
          </DialogHeader>
          <VercelTokenInput
            onTokenSet={handleTokenSet}
            onCancel={handleTokenCancel}
          />
        </DialogContent>
      </Dialog>

      {storedToken && (
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
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Deploy to Vercel
            </>
          )}
        </Button>
      )}

      {/* Deployment Status */}
      {deployStatus && (
        <div
          className={`w-full max-w-md p-4 rounded-lg border ${deployStatus.type === "success"
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
                  className="text-sm underline mt-1 flex items-center gap-1 text-blue-600"
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