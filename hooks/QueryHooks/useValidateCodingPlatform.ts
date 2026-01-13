import { useMutation } from "@tanstack/react-query";
import { useLeetCodeStore } from "@/app/store";
import { postValidateApi } from "@/lib/apiHelpers/api";

interface ValidateCodingPlatformResponse {
  valid: boolean;
  success: boolean;
  data?: {
    username?: string;
    profileUrl?: string;
  };
  error?: string;
}

interface ValidateCodingPlatformParams {
  platform: string;
  url: string;
}

async function validateCodingPlatform({
  platform,
  url,
}: ValidateCodingPlatformParams): Promise<ValidateCodingPlatformResponse> {
  return postValidateApi<{
    username?: string;
    profileUrl?: string;
  }>(`/api/${platform}/validate`, { url });
}

export function useValidateCodingPlatform() {
  const setLeetCodeUrl = useLeetCodeStore((state) => state.setLeetCodeUrl);

  return useMutation({
    mutationFn: validateCodingPlatform,
    onSuccess: (data, variables) => {
      if (data.success && data.valid && data.data?.profileUrl) {
        // Only update store if platform is leetcode
        if (variables.platform === "leetcode") {
          setLeetCodeUrl(data.data.profileUrl);
        }
      }
    },
  });
}
