

export interface VercelProjectConfig {
  name: string;
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  gitRepository?: {
    repo: string;
    type: 'github';
  };
}

export interface VercelDeploymentResult {
  id: string;
  url: string;
  alias: string[];
  project?: {
    id: string;
    name: string;
  };
}

class VercelService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createProject(config: VercelProjectConfig) {
    try {
      const response = await fetch('https://api.vercel.com/v9/projects', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: config.name,
          framework: config.framework || 'nextjs',
          buildCommand: config.buildCommand,
          outputDirectory: config.outputDirectory,
          installCommand: config.installCommand,
          devCommand: config.devCommand,
          gitRepository: config.gitRepository,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create Vercel project: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Vercel project:', error);
      throw error;
    }
  }

  async deployProject(projectId: string, repoUrl: string): Promise<VercelDeploymentResult> {
    try {
      // First, link the git repository to the project
      await this.linkGitRepository(projectId, repoUrl);

      // Then trigger a deployment
      const response = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: projectId,
          project: projectId,
          target: 'production',
          gitSource: {
            type: 'github',
            repo: repoUrl,
            ref: 'main',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to deploy to Vercel: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deploying to Vercel:', error);
      throw error;
    }
  }

  private async linkGitRepository(projectId: string, repoUrl: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/link`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          type: 'github',
          repo: repoUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to link Git repository: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error linking Git repository:', error);
      throw error;
    }
  }

  async getProject(projectId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get Vercel project: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Vercel project:', error);
      throw error;
    }
  }

  async getDeploymentStatus(deploymentId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get deployment status: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting deployment status:', error);
      throw error;
    }
  }
}

export function createVercelService(accessToken: string): VercelService {
  return new VercelService(accessToken);
}