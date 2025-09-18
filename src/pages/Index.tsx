import { useState } from "react";
import { CampaignSidebar, CampaignConfig, CampaignFiles } from "@/components/CampaignSidebar";
import { CampaignResults } from "@/components/CampaignResults";
import { OpenAIKeyInput } from "@/components/OpenAIKeyInput";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Palette, Languages, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";
import { 
  generateCampaignContent, 
  generateCampaignImage, 
  generateSEOKeywords, 
  validateCompliance,
  cleanText,
  CampaignResult 
} from "@/utils/campaignGenerator";

const Index = () => {
  const [config, setConfig] = useState<CampaignConfig>({
    businessUnit: "BU1-Dog",
    languages: ["EN"],
    campaignName: "Gut Health Autumn Launch",
    petType: "Dog",
    segment: "New Owner",
    brandVoice: "Warm, expert, fun",
    tone: "Friendly",
    regions: ["US"],
    defaultHashtags: "#GutHealth #PuppyStrong #BoneBoost"
  });
  
  const [files, setFiles] = useState<CampaignFiles>({});
  const [results, setResults] = useState<CampaignResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiInput, setShowApiInput] = useState(false);

  const handleGenerateCampaign = async () => {
    if (!files.catalog || config.languages.length === 0) {
      toast.error("Please upload a product catalog and select at least one language");
      return;
    }

    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setResults([]);

    try {
      const campaignResults: CampaignResult[] = [];
      const total = files.catalog.length * config.languages.length;
      let current = 0;

      // Create analytics and feedback dictionaries
      const analyticsDict: { [key: string]: any } = {};
      const feedbackDict: { [key: string]: any } = {};

      if (files.analytics) {
        files.analytics.forEach((row: any) => {
          if (row.product_name) {
            analyticsDict[row.product_name] = row;
          }
        });
      }

      if (files.feedback) {
        files.feedback.forEach((row: any) => {
          if (row.product_name) {
            feedbackDict[row.product_name] = row;
          }
        });
      }

      for (const product of files.catalog) {
        for (const language of config.languages) {
          current++;
          setGenerationProgress((current / total) * 100);

          const productName = cleanText(product.product_name || `SKU_${current}`);
          const category = cleanText(product.category || "");
          const ingredients = cleanText(product.ingredients || "");
          const benefits = cleanText(product.benefits || "");
          const price = product.price ? `$${product.price}` : "";
          
          const analyticData = analyticsDict[productName];
          const analyticKeywords = analyticData?.seo_keywords || "";
          
          const feedbackData = feedbackDict[productName];
          const feedbackText = feedbackData?.comment || "";

          // Generate content
          const description = await generateCampaignContent(
            productName,
            category,
            ingredients,
            benefits,
            price,
            config,
            language,
            analyticKeywords,
            feedbackText,
            apiKey
          );

          // Generate SEO keywords from content
          const seoKeywords = generateSEOKeywords(description, analyticKeywords);

          // Validate compliance
          const complianceIssues = validateCompliance(description, config.regions);

          // Generate image
          const imagePrompt = `${config.petType} food campaign for ${config.segment} | ${config.tone} | ${config.brandVoice} | ${productName} | Campaign: ${config.campaignName}`;
          const imageUrl = await generateCampaignImage(imagePrompt);

          campaignResults.push({
            sku: productName,
            language,
            campaign: config.campaignName,
            businessUnit: config.businessUnit,
            segment: config.segment,
            petType: config.petType,
            brandVoice: config.brandVoice,
            tone: config.tone,
            description,
            seoKeywords,
            hashtags: config.defaultHashtags,
            complianceIssues: complianceIssues.join("; "),
            imageUrl,
            date: new Date().toISOString().split('T')[0]
          });

          // Small delay to prevent rate limiting
          if (current < total) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      setResults(campaignResults);
      toast.success(`Generated content for ${campaignResults.length} campaign variations!`);
    } catch (error) {
      console.error("Error generating campaign:", error);
      toast.error("Failed to generate campaign content. Please check your API key.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleExportResults = () => {
    if (results.length === 0) return;

    const csvContent = [
      ["SKU", "Language", "Campaign", "Business Unit", "Segment", "Pet Type", "Brand Voice", "Tone", "Description & IG Post", "SEO Keywords", "Hashtags", "Compliance Issues", "Image URL", "Date"],
      ...results.map(result => [
        result.sku,
        result.language,
        result.campaign,
        result.businessUnit,
        result.segment,
        result.petType,
        result.brandVoice,
        result.tone,
        result.description,
        result.seoKeywords,
        result.hashtags,
        result.complianceIssues,
        result.imageUrl || "",
        result.date
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "campaign_assets.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Campaign assets exported successfully!");
  };

  const stats = [
    { title: "Business Units", value: "3", icon: Globe, color: "text-blue-600" },
    { title: "Languages Supported", value: config.languages.length, icon: Languages, color: "text-green-600" },
    { title: "Campaign Results", value: results.length, icon: TrendingUp, color: "text-purple-600" },
    { title: "Products Processed", value: files.catalog?.length || 0, icon: Palette, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <CampaignSidebar
          config={config}
          files={files}
          onConfigChange={setConfig}
          onFilesChange={setFiles}
          onGenerateCampaign={handleGenerateCampaign}
          isGenerating={isGenerating}
        />
        
        <div className="flex-1 p-6 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              🐾 Multi-BU Multi-Language Campaign Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Power complex, brand-safe, personalized content and image creation for pet brands across multiple business units and languages
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {!files.catalog ? (
            <Card>
              <CardHeader>
                <CardTitle>📋 Quick Start Guide</CardTitle>
                <CardDescription>
                  Get started with multi-language campaign generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">1. Upload Product Catalog</h4>
                      <p className="text-sm text-muted-foreground">
                        CSV with columns: product_name, category, ingredients, benefits, price
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">2. Configure Campaign</h4>
                      <p className="text-sm text-muted-foreground">
                        Set business unit, languages, target segments, and brand voice
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">3. Generate Content</h4>
                      <p className="text-sm text-muted-foreground">
                        AI creates personalized content and images for all configurations
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ Optional Enhancement Files:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Analytics CSV:</strong> product_name, seo_keywords, engagement_rate</li>
                      <li>• <strong>Feedback CSV:</strong> product_name, comment, rating</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {showApiInput && (
                <Card>
                  <CardHeader>
                    <CardTitle>🔑 OpenAI API Configuration</CardTitle>
                    <CardDescription>
                      Enter your OpenAI API key to generate high-quality content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">OpenAI API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleGenerateCampaign}
                          disabled={!apiKey || isGenerating}
                        >
                          Generate with AI
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setShowApiInput(false);
                            handleGenerateCampaign();
                          }}
                        >
                          Generate without AI (Demo Mode)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isGenerating && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Palette className="h-5 w-5 animate-spin" />
                        <p className="text-foreground font-medium">
                          Generating multi-language campaign content & images...
                        </p>
                      </div>
                      <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(generationProgress)}% complete
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Processing {files.catalog?.length} products × {config.languages.length} languages = {(files.catalog?.length || 0) * config.languages.length} content pieces
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.length > 0 && (
                <CampaignResults 
                  results={results} 
                  onExport={handleExportResults}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
