"use client";

import { useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDeploymentStore } from "@/app/store";
import type { GitHubData } from "@/app/store";

interface PublishToGitHubButtonProps {
  portfolioData: GitHubData;
}

export function PublishToGitHubButton({ portfolioData }: PublishToGitHubButtonProps) {
  const { data: session, status } = useSession();
  const { setGithubDeployed } = useDeploymentStore();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    repoUrl?: string;
  }>({ type: null, message: "" });

  const handlePublish = useCallback(async () => {
    // Check authentication first
    if (status !== "authenticated" || !session?.accessToken) {
      // Trigger GitHub sign in
      signIn("github");
      return;
    }

    setIsDeploying(true);
    setDeployStatus({ type: null, message: "" });

    try {
      // Deploy portfolio to GitHub
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubData: portfolioData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save GitHub deployment info
        setGithubDeployed(result.data.repo.html_url);
        
        setDeployStatus({
          type: "success",
          message: "Portfolio successfully published to GitHub! Ready for Vercel deployment.",
          repoUrl: result.data.repo.html_url,
        });
      } else {
        setDeployStatus({
          type: "error",
          message: result.error || "Failed to publish to GitHub",
        });
      }
    } catch (error) {
      console.error("GitHub deployment error:", error);
      setDeployStatus({
        type: "error",
        message: "An error occurred while publishing to GitHub. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  }, [portfolioData, status, session, setGithubDeployed]);

  const githubButtonDisabled = isDeploying;

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
              {deployStatus.repoUrl && (
                <a
                  href={deployStatus.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-1 flex items-center gap-1"
                >
                  <GithubIcon className="h-3 w-3" />
                  View repository →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <Button
          onClick={handlePublish}
          disabled={githubButtonDisabled}
          className="cursor-pointer min-w-[200px]"
          size="lg"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Publishing...
            </>
          ) : status !== "authenticated" ? (
            <>
              <GithubIcon className="h-4 w-4 mr-2" />
              Sign in to Publish
            </>
          ) : (
            <>
              <GithubIcon className="h-4 w-4 mr-2" />
              Publish to GitHub
            </>
          )}
        </Button>

        {status !== "authenticated" && (
          <p className="text-xs text-muted-foreground text-center max-w-md">
            You&apos;ll be prompted to sign in with GitHub to create and publish your portfolio repository.
          </p>
        )}
      </div>
    </div>
  );
}