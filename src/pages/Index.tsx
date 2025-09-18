import { useState } from "react";
import { DataRecord, ValidationError } from "@/types/data";
import { ProductLaunch } from "@/types/product";
import { validateCsvData } from "@/utils/validation";
import { generateDescriptionsForAllProducts } from "@/utils/openai";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { ValidationResults } from "@/components/ValidationResults";
import { OpenAIKeyInput } from "@/components/OpenAIKeyInput";
import { ExportButton } from "@/components/ExportButton";
import { ProductLaunchWizard } from "@/components/ProductLaunchWizard";
import { UserSegmentManager } from "@/components/UserSegmentManager";
import { OpenAPIIntegration } from "@/components/OpenAPIIntegration";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Zap, Users, Database, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [validData, setValidData] = useState<DataRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [enrichedData, setEnrichedData] = useState<DataRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAIInput, setShowAIInput] = useState(false);
  const [productLaunches, setProductLaunches] = useState<ProductLaunch[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  const handleFileLoad = (data: any[], name: string) => {
    setRawData(data);
    setFileName(name);
    setEnrichedData([]);
    setShowAIInput(false);
    
    // Validate the data
    const { valid, errors } = validateCsvData(data);
    setValidData(valid);
    setValidationErrors(errors);
    
    toast.success(`Loaded ${data.length} rows from ${name}`);
  };

  const handleGenerateDescriptions = async (apiKey: string) => {
    if (validData.length === 0) {
      toast.error("No valid data to process");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const enriched = await generateDescriptionsForAllProducts(
        validData,
        apiKey,
        (current, total) => {
          setGenerationProgress((current / total) * 100);
        }
      );
      
      setEnrichedData(enriched);
      toast.success("Successfully generated all product descriptions!");
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Failed to generate descriptions. Please check your API key.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleLaunchCreated = (launch: ProductLaunch) => {
    setProductLaunches(prev => [...prev, launch]);
  };

  const handleContentGenerated = (posts: any[]) => {
    setGeneratedPosts(prev => [...prev, ...posts]);
  };

  const stats = [
    { title: "Product Launches", value: productLaunches.length, icon: Target, color: "text-blue-600" },
    { title: "Generated Posts", value: generatedPosts.length, icon: TrendingUp, color: "text-green-600" },
    { title: "CSV Files Processed", value: rawData.length > 0 ? 1 : 0, icon: Database, color: "text-purple-600" },
    { title: "Valid Records", value: validData.length, icon: BarChart3, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Pet Product Marketing Automation Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch dog food products with AI-powered SEO optimization, personalized social media content, and comprehensive marketing automation
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

        <Tabs defaultValue="product-launch" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="product-launch" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Product Launch
            </TabsTrigger>
            <TabsTrigger value="user-segments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Segments
            </TabsTrigger>
            <TabsTrigger value="data-processing" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Processing
            </TabsTrigger>
            <TabsTrigger value="api-integration" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              API Integration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="product-launch">
            <div className="space-y-6">
              <ProductLaunchWizard onLaunchCreated={handleLaunchCreated} />
              
              {productLaunches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Product Launches</CardTitle>
                    <CardDescription>
                      Track your product launch campaigns and their performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productLaunches.map((launch) => (
                        <div key={launch.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="space-y-1">
                            <h3 className="font-medium">{launch.name}</h3>
                            <div className="flex gap-2">
                              <Badge variant="outline">{launch.category.replace('_', ' ')}</Badge>
                              <Badge variant="secondary">{launch.status}</Badge>
                              <Badge>${launch.price}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              SEO Keywords: {launch.seoKeywords.length} | 
                              Social Posts: {launch.socialMediaCopy.instagram.length}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Launch Date</div>
                            <div className="font-medium">{launch.launchDate || 'TBD'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="user-segments">
            <UserSegmentManager onContentGenerated={handleContentGenerated} />
            
            {generatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Personalized Content</CardTitle>
                  <CardDescription>
                    AI-generated social media posts tailored to different user segments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {generatedPosts.map((post, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <Badge>{post.platform}</Badge>
                          <Badge variant="outline">{post.targetSegment}</Badge>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags?.map((hashtag: string, idx: number) => (
                            <span key={idx} className="text-xs text-primary">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data-processing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CSV Data Processing & Validation</CardTitle>
                  <CardDescription>
                    Upload and validate your product data for marketing automation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileLoad={handleFileLoad} />
                </CardContent>
              </Card>

              {rawData.length > 0 && (
                <>
                  <DataTable
                    data={rawData.slice(0, 10)} 
                    title={`Raw Data Preview (${fileName})`}
                  />

                  <ValidationResults 
                    errors={validationErrors} 
                    validCount={validData.length}
                  />

                  {validData.length > 0 && (
                    <>
                      <DataTable
                        data={validData}
                        title="Valid Data"
                      />

                      {!showAIInput && !isGenerating && enrichedData.length === 0 && (
                        <div className="text-center">
                          <Button
                            onClick={() => setShowAIInput(true)}
                            size="lg"
                          >
                            Generate AI Product Descriptions
                          </Button>
                        </div>
                      )}

                      {showAIInput && !isGenerating && (
                        <OpenAIKeyInput 
                          onKeySubmit={handleGenerateDescriptions}
                          isLoading={isGenerating}
                        />
                      )}

                      {isGenerating && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                              <p className="text-foreground font-medium">
                                Generating product descriptions...
                              </p>
                              <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                              <p className="text-sm text-muted-foreground">
                                {Math.round(generationProgress)}% complete
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {enrichedData.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Enriched Data with AI Descriptions</h3>
                            <ExportButton data={enrichedData} filename="enriched_products.csv" />
                          </div>
                          <DataTable
                            data={enrichedData}
                            title="Final Enriched Dataset"
                            showDescription={true}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="api-integration">
            <OpenAPIIntegration />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Marketing Performance Analytics
                </CardTitle>
                <CardDescription>
                  Track campaign performance, engagement metrics, and ROI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-muted-foreground">Campaign Success Rate</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">2.8M</div>
                      <div className="text-sm text-muted-foreground">Total Reach</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-purple-600">4.2x</div>
                      <div className="text-sm text-muted-foreground">Average ROI</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <h4 className="font-semibold mb-4">Key Insights & Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Puppy health content performs 3x better than general dog food posts</li>
                    <li>• "Gut health" keywords show highest conversion rates (8.4%)</li>
                    <li>• New puppy owner segment has 2x higher engagement</li>
                    <li>• Instagram posts with user-generated content see 45% more shares</li>
                    <li>• Morning posts (8-10 AM) generate optimal engagement for pet products</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
