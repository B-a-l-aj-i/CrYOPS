"use client";

import { useEffect, useState } from "react";
import { Github, Loader2, Check, X } from "lucide-react";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useValidateGithub } from "@/hooks/QueryHooks/useValidateGithub";
import { useSession } from "next-auth/react";

export function GitHub() {
  const { data: session } = useSession();

  const [githubProfile, setGithubProfile] = useState<string>("");

  const validateGithubMutation = useValidateGithub();

  useEffect(() => {
    const url = session?.user?.githubProfileUrl;

    if (!url) return;

    setTimeout(() => {
      setGithubProfile(url);
    }, 0);
  }, [session?.user?.githubProfileUrl]);

  const handleValidateGithub = () => {
    if (!githubProfile.trim()) return;

    // Extract username from URL or use as-is
    const username = githubProfile
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .replace(/\/$/, "");
    validateGithubMutation.mutate({ username, githubUrl: githubProfile });
  };

  // Reset validation status when input changes
  const handleGithubProfileChange = (value: string) => {
    setGithubProfile(value);
    validateGithubMutation.reset();
  };

  const isValidatingGithub = validateGithubMutation.isPending;
  const githubValidationStatus = validateGithubMutation.isSuccess
    ? validateGithubMutation.data?.valid
      ? "success"
      : "error"
    : validateGithubMutation.isError
      ? "error"
      : null;

  return (
    <InputField
      label="GitHub Profile"
      placeholder="github.com/username"
      icon={Github}
      value={githubProfile}
      onChange={handleGithubProfileChange}
      rightButton={
        githubProfile.trim() ? (
          <Button
            onClick={handleValidateGithub}
            disabled={isValidatingGithub}
            size="sm"
            variant="outline"
            className={cn(
              "h-7 px-3 text-xs",
              githubValidationStatus === "success" &&
                "border-green-500 bg-green-50 text-green-700 hover:bg-green-100",
              githubValidationStatus === "error" &&
                "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
            )}
          >
            {isValidatingGithub ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : githubValidationStatus === "success" ? (
              <Check className="h-3 w-3" />
            ) : githubValidationStatus === "error" ? (
              <X className="h-3 w-3" />
            ) : (
              "Validate"
            )}
          </Button>
        ) : undefined
      }
    />
  );
}
