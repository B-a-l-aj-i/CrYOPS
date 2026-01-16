'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGithubStore, useDeploymentStore } from "../store";
import { GitHubData } from "../store";
import { Card, CardContent } from "@/components/ui/card";
import { PublishToGitHubButton } from "@/components/publish-to-github-button";
import { DeployToVercelButton } from "@/components/deploy-to-vercel-button";
import About from "@/components/about";
import { AlertCircle, Github, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditYOPSPage() {
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get stores
  const githubData = useGithubStore((state) => state.githubData); 
  
  // Deployment state
  const { isGithubDeployed, repoUrl, vercelUrl } = useDeploymentStore();

  useEffect(() => {
    // Determine which data to use
    if (githubData) {
      setPortfolioData(githubData);
    }
    setLoading(false);
  }, [githubData, setPortfolioData, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Portfolio Data Found</h2>
          <p className="text-muted-foreground mb-6">
            Please generate a portfolio first to see it here.
          </p>
          <Button onClick={() => router.push("/")} className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Generator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start Over
              </Button>
              

            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {isGithubDeployed && repoUrl && (
                <div className="flex items-center gap-1">
                  <Github className="h-4 w-3" />
                  <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">  
                    <span>GitHub</span>
                  </a>
                </div>
              )}
              {vercelUrl && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-3" />
                  <a href={vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">  
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
        <About githubData={portfolioData} />
      </main>

      {/* Deployment controls */}
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Publish Your Portfolio</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your portfolio is ready! Publish it to GitHub and deploy it to Vercel to share it with the world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* GitHub Publish Button */}
                {!isGithubDeployed && (
                  <PublishToGitHubButton 
                    portfolioData={portfolioData}
                  />
                )}

                {/* Vercel Deploy Button - Only show after GitHub deployment */}
                {isGithubDeployed && !vercelUrl && (
                  <DeployToVercelButton />
                )}

                {/* View deployed links */}
                {repoUrl && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">  
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Repository
                    </Button>
                    </a>
                    
                    {vercelUrl && (
                      <a href={vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">  
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Site
                      </Button>
                    </a>
                    )}
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