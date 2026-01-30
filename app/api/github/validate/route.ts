import { NextRequest } from "next/server";
import { githubValidateSchema } from "@/lib/validations/github";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  // Validate with Zod
  const validation = githubValidateSchema.safeParse({ username });
  if (!validation.success) {
    return Response.json(
      {
        valid: false,
        error: validation.error.issues[0]?.message || "Validation failed",
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return Response.json({ valid: true, data });
    }

    return Response.json({ valid: false }, { status: response.status });
  } catch {
    return Response.json(
      { valid: false, error: "Failed to validate" },
      { status: 500 }
    );
  }
}
