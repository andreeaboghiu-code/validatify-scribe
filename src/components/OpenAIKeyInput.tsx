import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";

interface OpenAIKeyInputProps {
  onKeySubmit: (apiKey: string) => void;
  isLoading?: boolean;
}

export function OpenAIKeyInput({ onKeySubmit, isLoading }: OpenAIKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">OpenAI API Configuration</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Enter your OpenAI API key to generate product descriptions. Your key is only used temporarily and not stored.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Button type="submit" disabled={!apiKey.trim() || isLoading}>
          {isLoading ? "Generating Descriptions..." : "Generate Product Descriptions"}
        </Button>
      </form>
    </Card>
  );
}