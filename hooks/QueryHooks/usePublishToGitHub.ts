import { useMutation } from "@tanstack/react-query";
import { useDeploymentStore } from "@/app/store";
import { postSuccessApi } from "@/lib/apiHelpers/api";
import type { GitHubData } from "@/app/store";

interface PublishToGitHubResponse {
  success: boolean;
  data?: {
    repo: {
      name: string;
      full_name: string;
      html_url: string;
      clone_url: string;
    };
    filesUploaded: number;
    totalFiles: number;
  };
  error?: string;
}

interface PublishToGitHubParams {
  githubData: GitHubData;
}

interface UsePublishToGitHubOptions {
  onSuccess?: (data: PublishToGitHubResponse) => void;
  onError?: (error: Error) => void;
}

async function publishToGitHub({
  githubData,
}: PublishToGitHubParams): Promise<PublishToGitHubResponse> {
  return postSuccessApi<PublishToGitHubResponse["data"]>(
    "/api/deploy",
    { githubData }
  );
}

export function usePublishToGitHub(options?: UsePublishToGitHubOptions) {
  const setGithubDeployed = useDeploymentStore(
    (state) => state.setGithubDeployed
  );

  return useMutation({
    mutationFn: publishToGitHub,
    onSuccess: (data) => {
      if (data.success && data.data?.repo.html_url) {
        // Save GitHub deployment info to store
        setGithubDeployed(data.data.repo.html_url);
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
