"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useGithubStore } from "@/app/store";
import type { GitHubData } from "@/app/store";

export function DeployButton() {
  const { data: session, status } = useSession();
  const githubData = useGithubStore((state) => state.githubData);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    repoUrl?: string;
  }>({ type: null, message: "" });


  const deployToGitHub = async () => {
    console.log("deployToGitHub");
    
    if (!session?.accessToken) {
      console.log("no access token");
      return;
    }
    console.log(session.accessToken);

    const response = await fetch(`https://api.github.com/repos/B-a-l-aj-i/CrYOPS-B-a-l-aj-i-1/deployments`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${session.accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: "main",
        payload: JSON.stringify({ ref: "main" }),
        description: "Deploy request from CrYOPS",
      }),
    });
    const result = await response.json();
    console.log(result);  
  };

  const handleDeploy = async () => {
    if (!githubData) {
      setDeployStatus({
        type: "error",
        message: "No GitHub data available. Please build your portfolio first.",
      });
      return;
    }

    if (status !== "authenticated" || !session) {
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
        setDeployStatus({
          type: "success",
          message: "Portfolio deployed successfully!",
          repoUrl: result.data.repo.html_url,
        });
      } else {
        setDeployStatus({
          type: "error",
          message: result.error || "Failed to deploy portfolio",
        });
      }
    } catch (error) {
      console.error("Deployment error:", error);
      setDeployStatus({
        type: "error",
        message: "An error occurred while deploying. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const isDisabled = isDeploying || status !== "authenticated" || !githubData;

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
                  className="text-sm underline mt-1 inline-block"
                >
                  View repository →
                </a>
              )}

              {
                deployStatus.type === "success" && (
                  <Button variant="outline" size="sm" className="text-xs">
                    Deploy to GitHub
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleDeploy}
        disabled={isDisabled}
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
            Publish to GitHub
          </>
        )}
      </Button>

      <Button
        onClick={deployToGitHub}
        disabled={false}
        className="min-w-[200px]"
        size="lg"
      >
        <GithubIcon className="h-4 w-4" />
        Deploy to GitHub
      </Button>

      {status !== "authenticated" && (
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Please sign in with GitHub to deploy your portfolio
        </p>
      )}
    </div>
  );
}
