import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Netlify from "next-auth/providers/netlify"

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
      githubUsername?: string
    }
    accessToken?: string
  }
  interface User {
    githubProfileUrl?: string
    githubUsername?: string
  }
}

// JWT token type extension is handled via the token parameter in callbacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  session: { 
    strategy: "jwt"  // stateless JWT in secure cookies, no DB needed
  },
  providers: [
    Netlify({
      clientId:process.env.NETLIFY_ID!,
      clientSecret:process.env.NETLIFY_SECRET!,
    }),
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
      // When user signs in with GitHub, store the profile URL and access token
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as GitHubProfile
        const tokenWithGithub = token as typeof token & { 
          githubProfileUrl?: string
          githubUsername?: string
          accessToken?: string
        }
        tokenWithGithub.githubProfileUrl = githubProfile.html_url || (githubProfile.login ? `https://github.com/${githubProfile.login}` : undefined)
        tokenWithGithub.githubUsername = githubProfile.login
        // Store the access token for API calls
        if (account.access_token) {
          tokenWithGithub.accessToken = account.access_token
        }
      }
      if (account?.provider === "netlify" && account.access_token) {
        const tokenWithNetlify = token as typeof token & {
          accessToken?: string
        }
        tokenWithNetlify.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Expose the GitHub profile URL, username, and access token in the session
      const tokenWithGithub = token as typeof token & { 
        githubProfileUrl?: string
        githubUsername?: string
        accessToken?: string
      }
      if (tokenWithGithub.githubProfileUrl && typeof tokenWithGithub.githubProfileUrl === "string") {
        session.user.githubProfileUrl = tokenWithGithub.githubProfileUrl
      }
      if (tokenWithGithub.githubUsername && typeof tokenWithGithub.githubUsername === "string") {
        session.user.githubUsername = tokenWithGithub.githubUsername
      }
      if (tokenWithGithub.accessToken && typeof tokenWithGithub.accessToken === "string") {
        session.accessToken = tokenWithGithub.accessToken
      }
      return session
    },
  },
})
