'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GithubIcon, ExternalLink, ArrowLeft } from "lucide-react";
import { useGithubStore, useDeploymentStore } from "@/app/store";
import { GitHubData } from "@/app/store";
import { PublishToGitHubButton } from "@/components/publish-to-github-button";
import { DeployToVercelButton } from "@/components/deploy-to-vercel-button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function PortfolioPage() {
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get stores
  const githubData = useGithubStore((state) => state.githubData);
  const { isGithubDeployed, repoUrl, vercelUrl } = useDeploymentStore();

  useEffect(() => {
    // Set portfolio data from GitHub store
    if (githubData) {
      setPortfolioData(githubData);
    } else {
      setPortfolioData(null);
    }
    setLoading(false);
  }, [githubData]);

  const handleStartOver = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-r-transparent border-l-transparent border-t-transparent"></div>
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
          <button
            onClick={handleStartOver}
            className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartOver}
                className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Generator
              </button>
              
              <div className="h-6 w-px bg-border"></div>
              
              <h1 className="text-lg font-semibold">Portfolio Preview</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {repoUrl && (
              <div className="flex items-center gap-1">
                <GithubIcon className="h-4 w-4" />
                <span>Deployed to GitHub</span>
              </div>
            )}
            
            {vercelUrl && (
              <div className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                <span>Deployed to Vercel</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Portfolio content */}
      <main>
        <div className="container mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border shadow-sm p-8">
                <div className="flex flex-col items-center justify-center mb-8">
                  <img
                    src={portfolioData.profile.avatar}
                    alt={portfolioData.profile.name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  <h1 className="text-3xl font-bold text-center mb-4">
                    {portfolioData.profile.name}
                  </h1>
                  <p className="text-xl text-muted-foreground text-center max-w-2xl mb-6 leading-relaxed">
                    {portfolioData.profile.bio}
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href={portfolioData.profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-6 bg-blue-50 rounded-2xl border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
                    >
                      <GithubIcon className="h-4 w-4" />
                      GitHub
                    </a>
                    {portfolioData.profile.blog && (
                      <a
                        href={portfolioData.profile.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-11 px-6 bg-blue-50 rounded-2xl border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Blog or Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Controls */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Publish Your Portfolio</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      Your portfolio is ready! Publish it to GitHub, then deploy to Vercel for a live URL.
                    </p>
                    
                    {/* GitHub Publish Button */}
                    {!isGithubDeployed && (
                      <PublishToGitHubButton 
                        portfolioData={portfolioData}
                      />
                    )}

                    {/* Vercel Deploy Button - Only show after GitHub deployment */}
                    {isGithubDeployed && (
                      <DeployToVercelButton 
                        githubRepoUrl={repoUrl || ''}
                        onDeploymentComplete={(data) => {
                          console.log('Vercel deployment completed:', data);
                        }}
                      />
                    )}

                    {/* Deployment Links */}
                    {(repoUrl || vercelUrl) && (
                      <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Your portfolio is live!</h4>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          {repoUrl && (
                            <a
                              href={repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline hover:no-underline flex items-center gap-1 text-blue-600"
                            >
                              <GithubIcon className="h-3 w-3" />
                              View Repository →
                            </a>
                          )}
                          
                          {vercelUrl && (
                            <a
                                href={vercelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline hover:no-underline flex items-center gap-1 text-blue-600"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Live Site →
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}