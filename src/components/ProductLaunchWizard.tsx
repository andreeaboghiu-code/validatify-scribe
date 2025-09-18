import { useState } from "react";
import { ProductLaunch } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSEOKeywords, generateMetaDescription } from "@/utils/seo";
import { generateInstagramPost, generateDynamicContent } from "@/utils/socialMedia";
import { toast } from "sonner";

interface ProductLaunchWizardProps {
  onLaunchCreated: (launch: ProductLaunch) => void;
}

export function ProductLaunchWizard({ onLaunchCreated }: ProductLaunchWizardProps) {
  const [formData, setFormData] = useState({
    name: "PuppyStrong Pro",
    category: "puppy_food" as const,
    targetAudience: "puppies" as const,
    healthFocus: ["gut_health", "bone_strength"],
    description: "Premium puppy nutrition designed to support digestive wellness and strong bone development in growing dogs.",
    price: 49.99,
    launchDate: ""
  });

  const [generatedContent, setGeneratedContent] = useState({
    seoKeywords: [] as any[],
    metaDescription: "",
    socialPosts: [] as any[]
  });

  const healthFocusOptions = [
    { id: "gut_health", label: "Gut Health & Digestion" },
    { id: "bone_strength", label: "Bone Strength & Development" },
    { id: "immune_support", label: "Immune System Support" },
    { id: "brain_development", label: "Brain & Cognitive Development" },
    { id: "coat_health", label: "Coat & Skin Health" }
  ];

  const handleHealthFocusChange = (focusId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      healthFocus: checked 
        ? [...prev.healthFocus, focusId]
        : prev.healthFocus.filter(f => f !== focusId)
    }));
  };

  const generateContent = () => {
    const seoKeywords = generateSEOKeywords(formData.name, formData.category, formData.healthFocus);
    const metaDescription = generateMetaDescription(formData.name, formData.healthFocus);
    
    const socialPosts = [
      generateInstagramPost(formData.name, "new_puppy_owner", formData.healthFocus),
      generateInstagramPost(formData.name, "experienced_owner", formData.healthFocus),
      generateInstagramPost(formData.name, "veterinarian", formData.healthFocus)
    ];

    setGeneratedContent({
      seoKeywords,
      metaDescription,
      socialPosts
    });

    toast.success("Content generated successfully!");
  };

  const handleSubmit = () => {
    const launch: ProductLaunch = {
      id: crypto.randomUUID(),
      ...formData,
      status: "draft",
      seoKeywords: generatedContent.seoKeywords.map(k => k.keyword),
      socialMediaCopy: {
        instagram: generatedContent.socialPosts.map(p => p.content),
        facebook: [],
        twitter: []
      }
    };

    onLaunchCreated(launch);
    toast.success("Product launch created successfully!");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐕 Dog Food Product Launch Wizard
        </CardTitle>
        <CardDescription>
          Create a comprehensive marketing strategy for your new puppy nutrition product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="product">Product Details</TabsTrigger>
            <TabsTrigger value="content">Generated Content</TabsTrigger>
            <TabsTrigger value="preview">Launch Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="product" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="e.g., PuppyStrong Pro"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({...prev, price: parseFloat(e.target.value)}))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puppy_food">Puppy Food</SelectItem>
                    <SelectItem value="dog_food">Adult Dog Food</SelectItem>
                    <SelectItem value="treats">Treats</SelectItem>
                    <SelectItem value="supplements">Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value: any) => setFormData(prev => ({...prev, targetAudience: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puppies">Puppies (0-12 months)</SelectItem>
                    <SelectItem value="adult_dogs">Adult Dogs (1-7 years)</SelectItem>
                    <SelectItem value="senior_dogs">Senior Dogs (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Health Focus Areas</Label>
              <div className="grid grid-cols-2 gap-2">
                {healthFocusOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.healthFocus.includes(option.id)}
                      onCheckedChange={(checked) => handleHealthFocusChange(option.id, checked as boolean)}
                    />
                    <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe your product's key benefits and features..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="launchDate">Target Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={formData.launchDate}
                onChange={(e) => setFormData(prev => ({...prev, launchDate: e.target.value}))}
              />
            </div>

            <Button onClick={generateContent} className="w-full">
              Generate SEO & Social Media Content
            </Button>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {generatedContent.seoKeywords.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">SEO Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.seoKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword.keyword} ({keyword.searchVolume})
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Meta Description</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {generatedContent.metaDescription}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Social Media Posts</h3>
                  <div className="space-y-4">
                    {generatedContent.socialPosts.map((post, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge>Instagram - {post.targetSegment}</Badge>
                          </div>
                          <p className="text-sm mb-2">{post.content}</p>
                          <div className="flex flex-wrap gap-1">
                            {post.hashtags.map((hashtag: string, idx: number) => (
                              <span key={idx} className="text-xs text-primary">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Complete the product details and click "Generate Content" to see SEO keywords and social media posts.
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <h3 className="font-semibold">Launch Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Product:</strong> {formData.name}
                </div>
                <div>
                  <strong>Price:</strong> ${formData.price}
                </div>
                <div>
                  <strong>Category:</strong> {formData.category.replace('_', ' ')}
                </div>
                <div>
                  <strong>Target:</strong> {formData.targetAudience}
                </div>
              </div>
              
              <div>
                <strong>Health Focus:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.healthFocus.map(focus => (
                    <Badge key={focus} variant="outline">
                      {focus.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {generatedContent.seoKeywords.length > 0 && (
                <Button onClick={handleSubmit} className="w-full">
                  Create Product Launch
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}