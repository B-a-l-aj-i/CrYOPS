import { useMutation } from "@tanstack/react-query";
import { useGithubStore } from "@/app/store";
import { useRouter } from "next/navigation";
import { postSuccessApi } from "@/lib/apiHelpers/api";
import type { GitHubData } from "@/app/store";

interface GetGithubDetailsResponse {
  success: boolean;
  data?: GitHubData;
  error?: string;
}

interface GetGithubDetailsParams {
  url: string;
}

async function getGithubDetails({
  url,
}: GetGithubDetailsParams): Promise<GetGithubDetailsResponse> {
  return postSuccessApi<GitHubData>(`/api/github/get-details`, { url });
}

export function useGetGithubDetails() {
  const setGithubData = useGithubStore((state) => state.setGithubData);
  const router = useRouter();

  return useMutation({
    mutationFn: getGithubDetails,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setGithubData(data.data);
        router.push(`/editYOPS`);
      }
    },
  });
}
