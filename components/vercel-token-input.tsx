"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
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
    _hasHydrated,
    setVercelToken,
    clearVercelToken
  } = useVercelTokenStore();

  // Get token from store (hydrated) or environment variable
  const effectiveToken = _hasHydrated 
    ? (storedToken)
    : undefined;

  const handleCancel = () => {
    setToken("");
    setValidationError("");
    setShowToken(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Handle ESC key to close
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      handleCancel();
    }
  };

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
    } catch {
      setValidationError("Failed to save token. Please try again.");
      setIsValidating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div 
      onKeyDown={handleKeyDown}
      className="space-y-4"
    >
        <CardContent className="pt-1 text-left">
          {/* Instructions */}
          {showInstructions && (
            <Card className="mb-4 border-blue-200 bg-blue-50 text-left">
              <CardHeader className="text-left">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-left">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                  How to get your Vercel Personal Access Token
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 text-left">
                  <li>Visit <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">vercel.com/account/tokens</a></li>
                  <li>Click &quot;Create Token&quot;</li>
                  <li>Give your token a name scope and expiration(no expiration is recommended)</li>
                  <li>Copy the generated token</li>
                  <li>Paste it in the field below</li>
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Current Status */}
          {effectiveToken && (
            <Card className="mb-4 border-green-200 bg-green-50 text-left">
              <CardContent className="pt-6 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      Vercel Connected
                    </span>
                  </div>
                  {storedToken && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearVercelToken()}
                      className="text-green-600 hover:text-green-700"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
                {/* Token Created Date */}
                {storedToken && tokenCreated && (
                  <div className="text-xs text-muted-foreground text-left mt-2">
                    Token added on {formatDate(tokenCreated)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Token Input Form */}
          {!effectiveToken && (
            <div className="space-y-3">
              <div className="space-y-4 mb">
                <Label htmlFor="vercel-token" >Vercel Personal Access Token</Label>
                <div className="relative">
                  <Input
                    id="vercel-token"
                    type={showToken ? "text" : "password"}
                    placeholder="xxxxxxxxxxxxxxxx"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && onCancel) {
                        handleCancel();
                      }
                    }}
                    className="font-mono text-sm mt-2"
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
                <Card className="border-red-200 bg-red-50 text-left">
                  <CardContent className="pt-6 text-left">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                      <span className="text-sm text-red-700">{validationError}</span>
                    </div>
                  </CardContent>
                </Card>
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
          <CardDescription className="mt-4 space-y-1 text-left">
            <p className="text-xs text-left">
              Learn more about <a href="https://vercel.com/docs/sign-in-with-vercel/tokens#access-token" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Vercel Personal Access Tokens</a>
            </p>
          </CardDescription>
        </CardContent>
    </div>
  );
}