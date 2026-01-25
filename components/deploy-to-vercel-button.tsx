"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useVercelTokenStore } from "@/app/store";
import { VercelTokenInput } from "./vercel-token-input";
import { useDeployToVercel } from "@/hooks/QueryHooks/useDeployToVercel";
import type { DeployToVercelResponse } from "@/hooks/QueryHooks/useDeployToVercel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";

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
            <Button
              variant="outline"
              className="min-w-[200px] cursor-pointer"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect Vercel for Live URL
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-md bg-white p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="mb-4 text-center text-lg font-semibold">
              Connect Vercel
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mb-4 text-center text-sm">
              Enter your Vercel Personal Access Token to deploy your portfolio
              to your Vercel account.
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
          className="min-w-[200px] cursor-pointer"
          size="lg"
          disabled={isDeploying || !githubRepoUrl || !storedToken}
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Deploy to Vercel
            </>
          )}
        </Button>
      )}

      {/* Deployment Status */}
      {deployStatus && (
        <div
          className={`w-full max-w-md rounded-lg border p-4 ${
            deployStatus.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-start gap-3">
            {deployStatus.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{deployStatus.message}</p>
              {deployStatus.vercelUrl && (
                <a
                  href={deployStatus.vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-blue-600 underline"
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
