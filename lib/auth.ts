import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

interface GitHubProfile {
  login?: string;
  html_url?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubProfileUrl?: string;
      githubUsername?: string;
    };
    accessToken?: string;
    vercelAccessToken?: string;
  }
  interface User {
    githubProfileUrl?: string;
    githubUsername?: string;
  }
}

// JWT token type extension is handled via the token parameter in callbacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt", // stateless JWT in secure cookies, no DB needed
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    error: "/auth/error",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initialize token properties if they don't exist
      const enhancedToken = token as typeof token & {
        githubProfileUrl?: string;
        githubUsername?: string;
        accessToken?: string;
      };

      // When user signs in with GitHub, store the profile URL and access token
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as GitHubProfile;
        enhancedToken.githubProfileUrl =
          githubProfile.html_url ||
          (githubProfile.login
            ? `https://github.com/${githubProfile.login}`
            : undefined);
        enhancedToken.githubUsername = githubProfile.login;
        // Store the access token for API calls
        if (account.access_token) {
          enhancedToken.accessToken = account.access_token;
        }
      }

      return enhancedToken;
    },
    async session({ session, token }) {
      // Expose all token data in the session
      const enhancedToken = token as typeof token & {
        githubProfileUrl?: string;
        githubUsername?: string;
        accessToken?: string;
      };

      // Only update fields that exist and are strings
      if (
        enhancedToken.githubProfileUrl &&
        typeof enhancedToken.githubProfileUrl === "string"
      ) {
        session.user.githubProfileUrl = enhancedToken.githubProfileUrl;
      }
      if (
        enhancedToken.githubUsername &&
        typeof enhancedToken.githubUsername === "string"
      ) {
        session.user.githubUsername = enhancedToken.githubUsername;
      }
      if (
        enhancedToken.accessToken &&
        typeof enhancedToken.accessToken === "string"
      ) {
        session.accessToken = enhancedToken.accessToken;
      }

      return session;
    },
  },
});
