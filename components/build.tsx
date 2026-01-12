"use client";

import { useState } from "react";
import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useGithubStore /* , useLeetCodeStore */ } from "@/app/store";
import { useGetGithubDetails } from "@/hooks/QueryHooks/useGetGithubDetails";

export function Build() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const getGithubDetailsMutation = useGetGithubDetails({
    onSuccess: () => {
      router.push(`/editYOPS`);
    },
  });

  const handleBuild = () => {
    // Reset error
    setError(null);

    // Get URLs from store
    // const leetCodeUrl = useLeetCodeStore.getState().leetCodeUrl;
    const githubUrl = useGithubStore.getState().githubUrl;

    // Validate URLs
    // if (!leetCodeUrl || !leetCodeUrl.trim()) {
    //   setError("Please provide a LeetCode URL");
    //   return;
    // }

    if (!githubUrl || !githubUrl.trim()) {
      setError("Please provide a GitHub URL");
      return;
    }

    // If validation passes, proceed
    getGithubDetailsMutation.mutate(
      { url: githubUrl },
      {
        onError: (err) => {
          setError(
            "Failed to fetch data. Please check your URLs and try again."
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
      ? "An error occurred. Please try again."
      : null);

  return (
    <div className="flex flex-col items-end gap-4 pt-6">
      {displayError && (
        <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {displayError}
        </div>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Save Draft</Button>
        <Button
          className="cursor-pointer"
          onClick={handleBuild}
          disabled={isLoading}
        >
          {isLoading ? "Building..." : "Build"}
          <PaintRollerIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
