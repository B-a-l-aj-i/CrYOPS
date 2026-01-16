"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ExternalLink, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useVercelTokenStore } from "@/app/store";

interface VercelTokenInputProps {
  onTokenSet?: (token: string) => void;
  onCancel?: () => void;
  showInstructions?: boolean;
}

export function VercelTokenInput({ onTokenSet, onCancel, showInstructions = true }: VercelTokenInputProps) {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  const {
    vercelToken: storedToken,
    tokenCreated,
    setVercelToken,
    clearVercelToken
  } = useVercelTokenStore();

  useEffect(() => {
    if (storedToken) {
      setToken(storedToken);
    }
  }, [storedToken]);

  const validateToken = (tokenValue: string): { isValid: boolean; error: string } => {
    if (!tokenValue.trim()) {
      return { isValid: false, error: "Token is required" };
    }
    
    if (tokenValue.length < 5) {
      return { 
        isValid: false, 
        error: "Token appears to be too short" 
      };
    }
    
    return { isValid: true, error: "" };
  };

  const handleSaveToken = async () => {
    setValidationError("");
    setIsValidating(true);
    
    const validation = validateToken(token);
    
    if (!validation.isValid) {
      setValidationError(validation.error);
      setIsValidating(false);
      return;
    }

    try {
      // Store token
      setVercelToken(token);
      setToken("");
      setShowToken(false);
      setIsValidating(false);
      
      // Notify parent component
      if (onTokenSet) {
        onTokenSet(token);
      }
    } catch (error) {
      setValidationError("Failed to save token. Please try again.");
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    setToken("");
    setValidationError("");
    setShowToken(false);
    if (onCancel) {
      onCancel();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-background">
      {/* Instructions */}
      {showInstructions && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <h4 className="font-semibold mb-2">How to get your Vercel Personal Access Token:</h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Visit <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">vercel.com/account/tokens</a></li>
                <li>Click "Create Token"</li>
                <li>Give your token a name (e.g., "CrYOPS Integration")</li>
                <li>Copy the generated token</li>
                <li>Paste it in the field below</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Current Status */}
      {storedToken && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">
              Vercel Connected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearVercelToken()}
            className="text-green-600 hover:text-green-700"
          >
            Disconnect
          </Button>
        </div>
      )}

      {/* Token Created Date */}
      {storedToken && tokenCreated && (
        <div className="text-xs text-muted-foreground text-center">
          Token added on {formatDate(tokenCreated)}
        </div>
      )}

      {/* Token Input Form */}
      {!storedToken && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="vercel-token">Vercel Personal Access Token</Label>
            <div className="relative">
              <Input
                id="vercel-token"
                type={showToken ? "text" : "password"}
                placeholder="vercel_xxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{validationError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveToken}
              disabled={isValidating || !token.trim()}
              className="min-w-[120px]"
            >
              {isValidating ? "Saving..." : "Save Token"}
            </Button>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          Your token is stored locally and used to deploy projects to your Vercel account.
        </p>
        <p>
          Learn more about <a href="https://vercel.com/docs/concepts/personal-access-tokens" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Vercel Personal Access Tokens</a>
        </p>
      </div>
    </div>
  );
}