import { useMutation } from "@tanstack/react-query";
import { useDeploymentStore } from "@/app/store";
import { postSuccessApi } from "@/lib/apiHelpers/api";
import type { GitHubData } from "@/app/store";
import type { TemplateConfig } from "@/types/template-config";

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
  templateConfig?: TemplateConfig;
}

interface UsePublishToGitHubOptions {
  onSuccess?: (data: PublishToGitHubResponse) => void;
  onError?: (error: Error) => void;
}

async function publishToGitHub({
  githubData,
  templateConfig,
}: PublishToGitHubParams): Promise<PublishToGitHubResponse> {
  return postSuccessApi<PublishToGitHubResponse["data"]>(
    "/api/github/publish",
    { githubData, templateConfig }
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
