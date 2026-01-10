'use client'

import { useState } from "react";
import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useGithubStore, useLeetCodeStore } from "@/app/store";
import { useRouter } from "next/navigation";

export function Build() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuild = async () => {
    // Reset error
    setError(null);

    // Get URLs from store
    const leetCodeUrl = useLeetCodeStore.getState().leetCodeUrl;
    const githubUrl = useGithubStore.getState().githubUrl;

    // Validate URLs
    if (!leetCodeUrl || !leetCodeUrl.trim()) {
      setError("Please provide a LeetCode URL");
      return;
    }

    if (!githubUrl || !githubUrl.trim()) {
      setError("Please provide a GitHub URL");
      return;
    }

    // If validation passes, proceed
    setIsLoading(true);
    
    try {

      const [leetCodeResponse, githubResponse] = await Promise.all([
        fetch(`/api/leetcode/get-details`, {
          method: "POST",
          body: JSON.stringify({
            url: leetCodeUrl,
          }),
        }),
        fetch(`/api/github/get-details`, {
          method: "POST",
          body: JSON.stringify({
            url: githubUrl,
          }),
        }),
      ]);

      const leetCodeData = await leetCodeResponse.json();
      const githubData = await githubResponse.json();

      if (leetCodeResponse.ok && githubResponse.ok) {
        useLeetCodeStore.setState({ leetCodeData: leetCodeData.data });
        useGithubStore.setState({ githubData: githubData.data });

        router.push(`/editYOPS`);

      } else {
        setError("Failed to fetch data. Please check your URLs and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4 pt-6">
      {error && (
        <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
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