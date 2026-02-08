import type { AboutStyleConfig } from "@/types/template-config";

/**
 * Generate the About.tsx component content.
 * This is a pure profile hero: avatar, name, bio, and social links.
 * GitHubStats and GitHubCalendar are rendered as separate grid cells by App.tsx.
 */
export function generateAboutComponent(styles: AboutStyleConfig): string {
  return `import { GithubIcon, GlobeIcon } from "lucide-react"
import type { GitHubData } from "../types"

interface AboutProps {
  githubData: GitHubData
}

export default function About({ githubData }: AboutProps) {
  const profile = {
    avatar: githubData.profile.avatar,
    name: githubData.profile.name,
    bio: githubData.profile.bio,
    githubUrl: githubData.profileUrl,
    blog: githubData.profile.blog,
  }

  return (
    <div className="flex flex-col justify-center items-center ${styles.sectionPadding}">
      <div className="inline-block mb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={${styles.avatarSize}}
          height={${styles.avatarSize}}
          className="rounded-full ${styles.avatarBorderClass}"
        />
      </div>

      <h1 className="${styles.nameClass}">{profile.name}</h1>

      <p className="${styles.bioClass}">
        {profile.bio}
      </p>

      <div className="flex justify-center gap-4">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="${styles.linkButtonClass}"
        >
          <GithubIcon className="w-4 h-4" />
          GitHub
        </a>

        {profile.blog && (
          <a
            href={profile.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="${styles.linkButtonClass}"
          >
            <GlobeIcon className="w-4 h-4" />
            Blog or Portfolio
          </a>
        )}
      </div>
    </div>
  )
}
`;
}
