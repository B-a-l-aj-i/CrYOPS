"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { usePublishToGitHub } from "@/hooks/QueryHooks/usePublishToGitHub";
import type { GitHubData } from "@/app/store";

interface PublishToGitHubButtonProps {
  portfolioData: GitHubData;
}

export function PublishToGitHubButton({
  portfolioData,
}: PublishToGitHubButtonProps) {
  const { data: session, status } = useSession();

  const publishMutation = usePublishToGitHub({
    onError: (error) => {
      console.error("GitHub deployment error:", error);
    },
  });

  const handlePublish = () => {
    // Check authentication first
    if (status !== "authenticated" || !session?.accessToken) {
      // Trigger GitHub sign in
      signIn("github");
      return;
    }

    // Trigger React Query mutation
    publishMutation.mutate({ githubData: portfolioData });
  };

  // Derive status from React Query mutation state
  const isDeploying = publishMutation.isPending;
  const deployStatus = publishMutation.isSuccess
    ? {
        type: "success" as const,
        message:
          "Portfolio successfully published to GitHub! Ready for Vercel deployment.",
        repoUrl: publishMutation.data?.data?.repo.html_url,
      }
    : publishMutation.isError
      ? {
          type: "error" as const,
          message:
            publishMutation.error?.message ||
            "An error occurred while publishing to GitHub. Please try again.",
          repoUrl: undefined,
        }
      : null;

  const githubButtonDisabled = isDeploying;

  return (
    <div className="flex flex-col items-center gap-4">
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
              {deployStatus.repoUrl && (
                <a
                  href={deployStatus.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm underline"
                >
                  <GithubIcon className="h-3 w-3" />
                  View repository →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 text-center">
        <Button
          onClick={handlePublish}
          disabled={githubButtonDisabled}
          className="min-w-[200px] cursor-pointer"
          size="lg"
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : status !== "authenticated" ? (
            <>
              <GithubIcon className="mr-2 h-4 w-4" />
              Sign in to Publish
            </>
          ) : (
            <>
              <GithubIcon className="mr-2 h-4 w-4" />
              Publish to GitHub
            </>
          )}
        </Button>

        {status !== "authenticated" && (
          <p className="text-muted-foreground max-w-md text-center text-xs">
            You&apos;ll be prompted to sign in with GitHub to create and publish
            your portfolio repository.
          </p>
        )}
      </div>
    </div>
  );
}
