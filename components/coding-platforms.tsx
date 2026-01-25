"use client";

import { useState } from "react";
import { Code, Plus, X, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useValidateCodingPlatform } from "@/hooks/QueryHooks/useValidateCodingPlatform";

const CODING_PLATFORMS = [
  { value: "leetcode", label: "LeetCode", icon: Code },
  { value: "hackerrank", label: "HackerRank", icon: Code },
  { value: "codeforces", label: "Codeforces", icon: Code },
  { value: "codewars", label: "Codewars", icon: Code },
  { value: "codechef", label: "CodeChef", icon: Code },
] as const;

interface CodingPlatform {
  id: string;
  platform: string;
  url: string;
  validationStatus?: "success" | "error" | null;
}

export function CodingPlatforms() {
  const [codingPlatforms, setCodingPlatforms] = useState<CodingPlatform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [validatingPlatformId, setValidatingPlatformId] = useState<
    string | null
  >(null);

  const validateCodingPlatformMutation = useValidateCodingPlatform();

  const handleAddPlatform = () => {
    if (!selectedPlatform || !usernameInput.trim()) return;

    const newPlatform: CodingPlatform = {
      id: `${selectedPlatform}-${Date.now()}`,
      platform: selectedPlatform,
      url: usernameInput.trim(),
      validationStatus: null,
    };

    setCodingPlatforms([...codingPlatforms, newPlatform]);
    setSelectedPlatform("");
    setUsernameInput("");
  };

  const handleRemovePlatform = (id: string) => {
    setCodingPlatforms(codingPlatforms.filter((p) => p.id !== id));
  };

  const handleExtractPlatform = (platform: CodingPlatform) => {
    setValidatingPlatformId(platform.id);

    // Update validation status to null (reset)
    setCodingPlatforms((prev) =>
      prev.map((p) =>
        p.id === platform.id ? { ...p, validationStatus: null } : p
      )
    );

    validateCodingPlatformMutation.mutate(
      {
        platform: platform.platform,
        url: platform.url,
      },
      {
        onSuccess: (result) => {
          console.log("Validation result:", result);
          // Update validation status based on result
          setCodingPlatforms((prev) =>
            prev.map((p) =>
              p.id === platform.id
                ? {
                    ...p,
                    validationStatus: result.valid ? "success" : "error",
                  }
                : p
            )
          );

          if (result.success && result.valid) {
            console.log("Validated profile:", result.data);
          }
        },
        onError: (error) => {
          console.error("Validation failed:", error);
          // Set error status on failure
          setCodingPlatforms((prev) =>
            prev.map((p) =>
              p.id === platform.id ? { ...p, validationStatus: "error" } : p
            )
          );
        },
        onSettled: () => {
          setValidatingPlatformId(null);
        },
      }
    );
  };

  const getPlatformLabel = (platformValue: string) => {
    return (
      CODING_PLATFORMS.find((p) => p.value === platformValue)?.label ||
      platformValue
    );
  };

  return (
    <div className="pointer-events-none space-y-3 opacity-50">
      <Label className="text-sm font-medium">Coding Platforms</Label>

      {/* Add Platform Form */}
      <div className="flex gap-2">
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {CODING_PLATFORMS.map((platform) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Code className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Enter username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddPlatform();
              }
            }}
            className="pl-10"
          />
        </div>

        <Button
          onClick={handleAddPlatform}
          disabled={!selectedPlatform || !usernameInput.trim()}
          size="icon"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Added Platforms List */}
      {codingPlatforms.length > 0 && (
        <div className="space-y-2">
          {codingPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-muted/30 flex items-center gap-2 rounded-lg border p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Code className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">
                    {getPlatformLabel(platform.platform)}
                  </span>
                </div>
                <span className="text-muted-foreground ml-6 text-xs">
                  {platform.url}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExtractPlatform(platform)}
                  disabled={
                    validatingPlatformId === platform.id ||
                    validateCodingPlatformMutation.isPending
                  }
                  className={cn(
                    platform.validationStatus === "success" &&
                      "border-green-500 bg-green-50 text-green-700 hover:bg-green-100",
                    platform.validationStatus === "error" &&
                      "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                  )}
                >
                  {validatingPlatformId === platform.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : platform.validationStatus === "success" ? (
                    <Check className="h-3 w-3" />
                  ) : platform.validationStatus === "error" ? (
                    <X className="h-3 w-3" />
                  ) : (
                    "Validate"
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemovePlatform(platform.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
