import { useMutation } from "@tanstack/react-query";
import { useGithubStore } from "@/app/store";
import { getValidateApi } from "@/lib/apiHelpers/api";

interface ValidateGithubResponse {
  valid: boolean;
  data?: unknown;
  error?: string;
}

interface ValidateGithubParams {
  username: string;
  githubUrl: string;
}

async function validateGithub({
  username,
}: ValidateGithubParams): Promise<ValidateGithubResponse> {
  return getValidateApi<unknown>(
    `/api/github/validate?username=${encodeURIComponent(username)}`
  );
}

export function useValidateGithub() {
  const setGithubUrl = useGithubStore((state) => state.setGithubUrl);

  return useMutation({
    mutationFn: validateGithub,
    onSuccess: (data, variables) => {
      if (data.valid) {
        setGithubUrl(variables.githubUrl);
      }
    },
  });
}
