import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

interface GitHubProfile {
  login?: string
  html_url?: string
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      githubProfileUrl?: string
    }
  }
  interface User {
    githubProfileUrl?: string
  }
}

// JWT token type extension is handled via the token parameter in callbacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { 
    strategy: "jwt"  // stateless JWT in secure cookies, no DB needed
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // When user signs in with GitHub, store the profile URL in the token
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as unknown as GitHubProfile
        const tokenWithGithub = token as typeof token & { githubProfileUrl?: string }
        tokenWithGithub.githubProfileUrl = githubProfile.html_url || (githubProfile.login ? `https://github.com/${githubProfile.login}` : undefined)
      }
      return token
    },
    async session({ session, token }) {
      // Expose the GitHub profile URL in the session
      const tokenWithGithub = token as typeof token & { githubProfileUrl?: string }
      if (tokenWithGithub.githubProfileUrl && typeof tokenWithGithub.githubProfileUrl === "string") {
        session.user.githubProfileUrl = tokenWithGithub.githubProfileUrl
      }
      return session
    },
  },
})
