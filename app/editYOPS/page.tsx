"use client";

import { useRouter } from "next/navigation";
import { useGithubStore, useDeploymentStore } from "../store";
import { Card, CardContent } from "@/components/ui/card";
import { PublishToGitHubButton } from "@/components/publish-to-github-button";
import { DeployToVercelButton } from "@/components/deploy-to-vercel-button";
import About from "@/components/about";
import { AlertCircle, Github, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function EditYOPSPage() {
  const router = useRouter();

  const githubData = useGithubStore((state) => state.githubData);
  const hasHydrated = useGithubStore((state) => state._hasHydrated);

  // Deployment state
  const { isGithubDeployed, repoUrl, vercelUrl } = useDeploymentStore();

  // Show loading while store is hydrating from localStorage
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <Spinner size="lg" className="text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!githubData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-2 text-xl font-semibold">
            No Portfolio Data Found
          </h2>
          <p className="text-muted-foreground mb-6">
            Please generate a portfolio first to see it here.
          </p>
          <Button onClick={() => router.push("/")} className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header with controls */}
      <header className="sticky top-0 z-10 border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              {isGithubDeployed && repoUrl && (
                <div className="flex items-center gap-1">
                  <Github className="h-4 w-3" />
                  <a
                    href={
                      repoUrl.startsWith("http")
                        ? repoUrl
                        : `https://${repoUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <span>GitHub</span>
                  </a>
                </div>
              )}
              {vercelUrl && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-3" />
                  <a
                    href={
                      vercelUrl.startsWith("http")
                        ? vercelUrl
                        : `https://${vercelUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <span>Vercel</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio content */}
      <main>
        <About githubData={githubData} />
      </main>

      {/* Deployment controls */}
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Publish Your Portfolio</h3>
              <p className="text-muted-foreground mx-auto max-w-md text-sm">
                Your portfolio is ready! Publish it to GitHub and deploy it to
                Vercel to share it with the world.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {/* GitHub Publish Button */}
                {!isGithubDeployed && (
                  <PublishToGitHubButton portfolioData={githubData} />
                )}

                {/* Vercel Deploy Button - Only show after GitHub deployment */}
                {isGithubDeployed && !vercelUrl && (
                  <DeployToVercelButton githubRepoUrl={repoUrl || ""} />
                )}

                {/* View deployed links */}
                {repoUrl && (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    {vercelUrl && (
                      <a
                        href={
                          vercelUrl.startsWith("http")
                            ? vercelUrl
                            : `https://${vercelUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        <Button variant="outline" className="cursor-pointer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live Site
                        </Button>
                      </a>
                    )}

                    <a
                      href={
                        repoUrl.startsWith("http")
                          ? repoUrl
                          : `https://${repoUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      <Button variant="outline" className="cursor-pointer">
                        <Github className="mr-2 h-4 w-4" />
                        View Repository
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
