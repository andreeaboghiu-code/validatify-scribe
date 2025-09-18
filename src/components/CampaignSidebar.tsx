import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/FileUpload";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface CampaignConfig {
  businessUnit: string;
  languages: string[];
  campaignName: string;
  petType: string;
  segment: string;
  brandVoice: string;
  tone: string;
  regions: string[];
  defaultHashtags: string;
}

export interface CampaignFiles {
  catalog?: any[];
  analytics?: any[];
  feedback?: any[];
}

interface CampaignSidebarProps {
  config: CampaignConfig;
  files: CampaignFiles;
  onConfigChange: (config: CampaignConfig) => void;
  onFilesChange: (files: CampaignFiles) => void;
  onGenerateCampaign: () => void;
  isGenerating?: boolean;
}

export function CampaignSidebar({ 
  config, 
  files, 
  onConfigChange, 
  onFilesChange, 
  onGenerateCampaign,
  isGenerating = false 
}: CampaignSidebarProps) {
  const handleLanguageToggle = (lang: string, checked: boolean) => {
    const newLanguages = checked 
      ? [...config.languages, lang]
      : config.languages.filter(l => l !== lang);
    
    onConfigChange({ ...config, languages: newLanguages });
  };

  const handleRegionToggle = (region: string, checked: boolean) => {
    const newRegions = checked 
      ? [...config.regions, region]
      : config.regions.filter(r => r !== region);
    
    onConfigChange({ ...config, regions: newRegions });
  };

  const handleFileLoad = (data: any[], name: string, type: 'catalog' | 'analytics' | 'feedback') => {
    onFilesChange({ ...files, [type]: data });
  };

  return (
    <div className="w-80 h-screen overflow-y-auto bg-background border-r">
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">🌍 Global Marketing Automation Setup</h2>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Campaign Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessUnit" className="text-xs">Business Unit</Label>
              <Select 
                value={config.businessUnit} 
                onValueChange={(value) => onConfigChange({ ...config, businessUnit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BU1-Dog">BU1-Dog</SelectItem>
                  <SelectItem value="BU2-Cat">BU2-Cat</SelectItem>
                  <SelectItem value="BU3-All Pets">BU3-All Pets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Languages</Label>
              <div className="space-y-2">
                {["EN", "FR", "DE", "ES", "IT"].map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={config.languages.includes(lang)}
                      onCheckedChange={(checked) => handleLanguageToggle(lang, checked as boolean)}
                    />
                    <Label htmlFor={lang} className="text-xs">{lang}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignName" className="text-xs">Campaign Name</Label>
              <Input
                id="campaignName"
                value={config.campaignName}
                onChange={(e) => onConfigChange({ ...config, campaignName: e.target.value })}
                placeholder="Gut Health Autumn Launch"
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petType" className="text-xs">Pet Category</Label>
              <Select 
                value={config.petType} 
                onValueChange={(value) => onConfigChange({ ...config, petType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment" className="text-xs">Target Segment</Label>
              <Select 
                value={config.segment} 
                onValueChange={(value) => onConfigChange({ ...config, segment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Owner">New Owner</SelectItem>
                  <SelectItem value="Experienced Owner">Experienced Owner</SelectItem>
                  <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                  <SelectItem value="Professional Breeder">Professional Breeder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandVoice" className="text-xs">Brand Voice Guidance</Label>
              <Textarea
                id="brandVoice"
                value={config.brandVoice}
                onChange={(e) => onConfigChange({ ...config, brandVoice: e.target.value })}
                placeholder="Warm, expert, fun"
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="text-xs">Tone</Label>
              <Select 
                value={config.tone} 
                onValueChange={(value) => onConfigChange({ ...config, tone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Playful">Playful</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Clinical">Clinical</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Trendy">Trendy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Compliance Regions</Label>
              <div className="space-y-2">
                {["EU", "US", "APAC"].map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={region}
                      checked={config.regions.includes(region)}
                      onCheckedChange={(checked) => handleRegionToggle(region, checked as boolean)}
                    />
                    <Label htmlFor={region} className="text-xs">{region}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashtags" className="text-xs">Default Hashtags</Label>
              <Input
                id="hashtags"
                value={config.defaultHashtags}
                onChange={(e) => onConfigChange({ ...config, defaultHashtags: e.target.value })}
                placeholder="#GutHealth #PuppyStrong #BoneBoost"
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Data Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Product Catalog (CSV)</Label>
              <FileUpload 
                onFileLoad={(data, name) => handleFileLoad(data, name, 'catalog')}
              />
              {files.catalog && (
                <Badge variant="secondary" className="text-xs">
                  {files.catalog.length} products loaded
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Analytics Data (CSV)</Label>
              <FileUpload 
                onFileLoad={(data, name) => handleFileLoad(data, name, 'analytics')}
              />
              {files.analytics && (
                <Badge variant="secondary" className="text-xs">
                  Analytics data loaded
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Feedback Data (CSV)</Label>
              <FileUpload 
                onFileLoad={(data, name) => handleFileLoad(data, name, 'feedback')}
              />
              {files.feedback && (
                <Badge variant="secondary" className="text-xs">
                  Feedback data loaded
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Button 
          onClick={onGenerateCampaign}
          disabled={!files.catalog || config.languages.length === 0 || isGenerating}
          className="w-full"
          size="sm"
        >
          {isGenerating ? "Generating..." : "Generate Multi-Lang Campaign"}
        </Button>

        {files.catalog && (
          <div className="text-xs text-muted-foreground">
            Ready to generate content for {files.catalog.length} products across {config.languages.length} languages
          </div>
        )}
      </div>
    </div>
  );
}