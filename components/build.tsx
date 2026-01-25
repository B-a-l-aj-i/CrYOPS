"use client";

import { useState } from "react";
import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useGithubStore } from "@/app/store";
import { useGetGithubDetails } from "@/hooks/QueryHooks/useGetGithubDetails";

export function Build() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const githubUrl = useGithubStore((state) => state.githubUrl);

  const getGithubDetailsMutation = useGetGithubDetails({
    onSuccess: () => {
      router.push(`/editYOPS`);
    },
  });

  const handleGenerateWithGitHub = () => {
    // Reset error
    setError(null);

    if (!githubUrl || !githubUrl.trim()) {
      setError("Please provide a GitHub URL");
      return;
    }

    // If validation passes, proceed with GitHub data fetching
    getGithubDetailsMutation.mutate(
      { url: githubUrl },
      {
        onError: (err) => {
          setError(
            "Failed to fetch data. Please check your GitHub URL and try again."
          );
          console.error(err);
        },
      }
    );
  };

  const isLoading = getGithubDetailsMutation.isPending;
  const displayError =
    error ||
    (getGithubDetailsMutation.error
      ? getGithubDetailsMutation.error.message
      : null);

  const hasGitHubUrl = githubUrl && githubUrl.trim();

  return (
    <div className="flex flex-col items-end gap-4 pt-6">
      {displayError && (
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {displayError}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Primary action for GitHub data */}
        {hasGitHubUrl && (
          <Button
            className="w-full cursor-pointer"
            onClick={handleGenerateWithGitHub}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Building..." : "Build"}
            <PaintRollerIcon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {!hasGitHubUrl && (
          <p className="text-muted-foreground text-center text-xs">
            Add your GitHub URL above to generate your portfolio.
          </p>
        )}
      </div>
    </div>
  );
}
