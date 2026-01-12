// Response types matching the actual API route formats
type ValidateResponse<T = unknown> = {
  valid: boolean;
  data?: T;
  error?: string;
};

type SuccessResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ValidateSuccessResponse<T = unknown> = {
  valid: boolean;
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * GET helper for validation endpoints that return { valid, data?, error? }
 * Throws on error for React Query onError compatibility.
 */
export const getValidateApi = async <T = unknown>(
  url: string,
  options?: Omit<RequestInit, "method">
): Promise<ValidateResponse<T>> => {
  const response = await fetch(url, options ?? {});

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * POST helper for validation endpoints that return { valid, success, data?, error? }
 * Throws on error for React Query onError compatibility.
 */
export const postValidateApi = async <T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestInit, "method" | "body" | "headers">
): Promise<ValidateSuccessResponse<T>> => {
  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * POST helper for endpoints that return { success, data?, error? }
 * Throws on error for React Query onError compatibility.
 */
export const postSuccessApi = async <T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<RequestInit, "method" | "body" | "headers">
): Promise<SuccessResponse<T>> => {
  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Try to parse error response, but don't fail if it's not JSON
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    } catch {
      throw new Error(`Request failed: ${response.status}`);
    }
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Request succeeded but operation failed.");
  }

  return data;
};
