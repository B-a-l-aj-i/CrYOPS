import { useMutation } from "@tanstack/react-query";
import { useDeploymentStore } from "@/app/store";
import { postSuccessApi } from "@/lib/apiHelpers/api";

interface VercelDeployment {
  url: string | null;
  dashboardUrl: string;
  projectId: string;
  deploymentId: string;
  status: string;
}

interface DeployToVercelResponse {
  success: boolean;
  data?: {
    vercelDeployment: VercelDeployment;
    message: string;
  };
  error?: string;
}

interface DeployToVercelParams {
  githubRepoUrl: string;
  vercelPat: string;
}

interface UseDeployToVercelOptions {
  onSuccess?: (data: DeployToVercelResponse) => void;
  onError?: (error: Error) => void;
}

async function deployToVercel({
  githubRepoUrl,
  vercelPat,
}: DeployToVercelParams): Promise<DeployToVercelResponse> {
  return postSuccessApi<DeployToVercelResponse["data"]>("/api/vercel/deploy", {
    githubRepoUrl,
    vercelPat,
  });
}

export function useDeployToVercel(options?: UseDeployToVercelOptions) {
  const setVercelDeployed = useDeploymentStore(
    (state) => state.setVercelDeployed
  );

  return useMutation({
    mutationFn: deployToVercel,
    onSuccess: (data) => {
      if (data.success && data.data?.vercelDeployment.url) {
        // Save Vercel deployment info to store
        setVercelDeployed(data.data.vercelDeployment.url);
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export type { DeployToVercelResponse, VercelDeployment };
