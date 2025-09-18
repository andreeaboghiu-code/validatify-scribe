import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Key, Zap } from "lucide-react";
import { toast } from "sonner";

export function OpenAPIIntegration() {
  const [apiKey] = useState("pk_live_12345..."); // Mock API key

  const apiEndpoints = [
    {
      method: "POST",
      path: "/api/products/launch",
      description: "Create a new product launch campaign",
      example: {
        name: "PuppyStrong Pro",
        category: "puppy_food",
        healthFocus: ["gut_health", "bone_strength"],
        targetAudience: "puppies"
      }
    },
    {
      method: "GET",
      path: "/api/seo/keywords",
      description: "Generate SEO keywords for a product",
      params: "?product=PuppyStrong&category=puppy_food"
    },
    {
      method: "POST",
      path: "/api/social/generate",
      description: "Generate social media content",
      example: {
        productName: "PuppyStrong Pro",
        platform: "instagram",
        segment: "new_puppy_owner"
      }
    },
    {
      method: "GET",
      path: "/api/analytics/performance",
      description: "Get campaign performance metrics",
      params: "?launchId=12345&timeframe=30d"
    }
  ];

  const integrationGuides = [
    {
      title: "E-commerce Platform",
      description: "Integrate with Shopify, WooCommerce, or custom stores",
      steps: [
        "Install our plugin/extension",
        "Configure API credentials",
        "Set up product sync",
        "Enable automated marketing campaigns"
      ]
    },
    {
      title: "Marketing Automation",
      description: "Connect with HubSpot, Mailchimp, or Klaviyo",
      steps: [
        "Set up webhook endpoints",
        "Configure audience segmentation",
        "Enable automated content generation",
        "Track performance metrics"
      ]
    },
    {
      title: "Social Media Management", 
      description: "Integrate with Buffer, Hootsuite, or Later",
      steps: [
        "Authenticate social accounts",
        "Set up content pipelines",
        "Configure posting schedules",
        "Enable performance tracking"
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            OpenAPI Integration Hub
          </CardTitle>
          <CardDescription>
            Connect your marketing automation platform with third-party services using our REST API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Key className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <Label className="font-medium">API Key</Label>
              <code className="block text-sm text-muted-foreground font-mono">
                {apiKey}
              </code>
            </div>
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(apiKey)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="integrations">Integration Guides</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks & Events</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {apiEndpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                      Try it
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>

                  {endpoint.example && (
                    <div>
                      <Label className="text-xs font-medium">Example Request Body:</Label>
                      <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto">
                        <code>{JSON.stringify(endpoint.example, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {endpoint.params && (
                    <div>
                      <Label className="text-xs font-medium">Parameters:</Label>
                      <code className="block mt-1 text-xs bg-muted p-2 rounded">
                        {endpoint.params}
                      </code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          {integrationGuides.map((guide, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guide.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-4" variant="outline">
                  View Integration Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>
                Set up webhooks to receive real-time notifications about campaign events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { event: "launch.created", description: "Triggered when a new product launch is created" },
                { event: "content.generated", description: "Triggered when AI content generation is completed" },
                { event: "campaign.published", description: "Triggered when social media content is published" },
                { event: "analytics.updated", description: "Triggered when performance metrics are updated" }
              ].map((webhook, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <code className="text-sm font-mono">{webhook.event}</code>
                    <p className="text-xs text-muted-foreground mt-1">{webhook.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Endpoint URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input placeholder="https://your-app.com/webhooks/marketing" className="flex-1" />
                    <Button size="sm">Test</Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Secret Key</Label>
                  <Input placeholder="your-webhook-secret" type="password" className="mt-1" />
                </div>

                <Button>Save Webhook Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}