import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Download, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wand2
} from "lucide-react";
import { OpenAIKeyInput } from "@/components/OpenAIKeyInput";
import { ExportButton } from "@/components/ExportButton";
import { DataRecord } from "@/types/data";
import { generateDescriptionsForAllProducts } from "@/utils/openai";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const sampleData: DataRecord[] = [
  { product_id: 1, product_name: "Wireless Headphones", price: 99.99, category: "Electronics" },
  { product_id: 2, product_name: "Coffee Mug", price: 15.99, category: "Home & Kitchen" },
  { product_id: 3, product_name: "Gaming Mouse", price: 79.99, category: "Electronics" },
  { product_id: 4, product_name: "Notebook", price: 12.99, category: "Office Supplies" },
  { product_id: 5, product_name: "Yoga Mat", price: 29.99, category: "Sports & Fitness" },
];

interface EnrichedDataWithFeedback extends DataRecord {
  description?: string;
  feedback?: 'positive' | 'negative' | null;
  expanded?: boolean;
}

export default function GenerateContent() {
  const [enrichedData, setEnrichedData] = useState<EnrichedDataWithFeedback[]>(sampleData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAIInput, setShowAIInput] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateDescriptions = async (apiKey: string) => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const enriched = await generateDescriptionsForAllProducts(
        sampleData,
        apiKey,
        (current, total) => {
          setGenerationProgress((current / total) * 100);
        }
      );
      
      const enrichedWithFeedback = enriched.map(item => ({
        ...item,
        feedback: null as 'positive' | 'negative' | null,
        expanded: false
      }));
      
      setEnrichedData(enrichedWithFeedback);
      setHasGenerated(true);
      toast.success("Successfully generated all product descriptions!");
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Failed to generate descriptions. Please check your API key.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleFeedback = (index: number, feedback: 'positive' | 'negative') => {
    const updated = [...enrichedData];
    updated[index].feedback = feedback;
    setEnrichedData(updated);
    
    toast.success(
      feedback === 'positive' 
        ? "Thanks for the positive feedback!" 
        : "Feedback noted. We'll improve future generations."
    );
  };

  const toggleExpanded = (index: number) => {
    const updated = [...enrichedData];
    updated[index].expanded = !updated[index].expanded;
    setEnrichedData(updated);
  };

  const regenerateDescription = async (index: number) => {
    // Mock regeneration - in real app, would call API again
    toast.success("Description regenerated!");
  };

  const positiveFeedback = enrichedData.filter(item => item.feedback === 'positive').length;
  const negativeFeedback = enrichedData.filter(item => item.feedback === 'negative').length;
  const totalGenerated = enrichedData.filter(item => item.description).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Generate Personalized Content</h2>
          <p className="text-muted-foreground">Create AI-powered product descriptions and gather feedback</p>
        </div>
        <div className="flex space-x-2">
          {hasGenerated && (
            <ExportButton 
              data={enrichedData.filter(item => item.description)} 
              filename="products_with_descriptions.csv" 
            />
          )}
        </div>
      </div>

      {/* Generation Stats */}
      {hasGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Generated</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGenerated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <ThumbsUp className="h-4 w-4 text-success" />
                <span>Positive</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{positiveFeedback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <ThumbsDown className="h-4 w-4 text-destructive" />
                <span>Negative</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{negativeFeedback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalGenerated > 0 ? Math.round((positiveFeedback / totalGenerated) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Product Data Sample</span>
            {!hasGenerated && !showAIInput && !isGenerating && (
              <Button
                onClick={() => setShowAIInput(true)}
                className="ml-auto flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Descriptions</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Product ID</th>
                  <th className="text-left p-4 font-medium">Product Name</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  {hasGenerated && <th className="text-left p-4 font-medium">Description</th>}
                  {hasGenerated && <th className="text-left p-4 font-medium">Feedback</th>}
                </tr>
              </thead>
              <tbody>
                {enrichedData.map((row, index) => (
                  <tr key={row.product_id} className="border-b hover:bg-muted/30">
                    <td className="p-4 font-medium">{row.product_id}</td>
                    <td className="p-4">{row.product_name}</td>
                    <td className="p-4">${row.price.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant="outline">{row.category}</Badge>
                    </td>
                    {hasGenerated && (
                      <td className="p-4 max-w-md">
                        {row.description ? (
                          <Collapsible>
                            <div className="flex items-start space-x-2">
                              <div className="flex-1">
                                <CollapsibleTrigger 
                                  className="text-left hover:text-primary"
                                  onClick={() => toggleExpanded(index)}
                                >
                                  <div className="text-sm">
                                    {row.expanded 
                                      ? row.description 
                                      : `${row.description.substring(0, 60)}...`
                                    }
                                  </div>
                                  {row.expanded ? (
                                    <ChevronUp className="h-4 w-4 inline ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 inline ml-1" />
                                  )}
                                </CollapsibleTrigger>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => regenerateDescription(index)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          </Collapsible>
                        ) : (
                          <span className="text-muted-foreground italic">
                            No description generated
                          </span>
                        )}
                      </td>
                    )}
                    {hasGenerated && (
                      <td className="p-4">
                        <div className="flex space-x-1">
                          <Button
                            variant={row.feedback === 'positive' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleFeedback(index, 'positive')}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={row.feedback === 'negative' ? 'destructive' : 'ghost'}
                            size="sm"
                            onClick={() => handleFeedback(index, 'negative')}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Key Input */}
      {showAIInput && !isGenerating && !hasGenerated && (
        <OpenAIKeyInput 
          onKeySubmit={handleGenerateDescriptions}
          isLoading={isGenerating}
        />
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Generating AI Product Descriptions...</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(generationProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      {hasGenerated && enrichedData.some(item => item.description) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <ExportButton 
                data={enrichedData.filter(item => item.description)} 
                filename="products_with_descriptions.csv" 
              />
              <Button variant="outline">
                Export as JSON
              </Button>
              <Button variant="outline">
                Export as Parquet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}