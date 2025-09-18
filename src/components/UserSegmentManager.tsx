import { useState } from "react";
import { UserProfile } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generateDynamicContent } from "@/utils/socialMedia";
import { toast } from "sonner";

interface UserSegmentManagerProps {
  onContentGenerated: (posts: any[]) => void;
}

export function UserSegmentManager({ onContentGenerated }: UserSegmentManagerProps) {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [productName, setProductName] = useState("PuppyStrong Pro");

  const userProfiles: UserProfile[] = [
    {
      id: "1",
      segment: "new_puppy_owner",
      interests: ["training", "health", "socialization"],
      dogBreed: "Golden Retriever",
      dogAge: 3,
      preferences: {
        contentType: ["tips", "success_stories", "health_info"],
        socialPlatforms: ["instagram", "facebook"]
      }
    },
    {
      id: "2", 
      segment: "experienced_owner",
      interests: ["advanced_training", "nutrition", "exercise"],
      dogBreed: "German Shepherd",
      dogAge: 24,
      preferences: {
        contentType: ["research", "comparisons", "expert_advice"],
        socialPlatforms: ["instagram", "twitter"]
      }
    },
    {
      id: "3",
      segment: "veterinarian",
      interests: ["clinical_research", "nutrition_science", "case_studies"],
      preferences: {
        contentType: ["scientific_content", "clinical_data"],
        socialPlatforms: ["twitter", "linkedin"]
      }
    },
    {
      id: "4",
      segment: "breeder",
      interests: ["breeding", "genetics", "puppy_development"],
      dogBreed: "Multiple",
      preferences: {
        contentType: ["breeding_tips", "development_guides"],
        socialPlatforms: ["instagram", "facebook"]
      }
    }
  ];

  const segmentLabels = {
    new_puppy_owner: "New Puppy Owner",
    experienced_owner: "Experienced Owner", 
    veterinarian: "Veterinarian",
    breeder: "Professional Breeder"
  };

  const handleGenerateContent = (profile: UserProfile) => {
    const healthFocus = ["gut_health", "bone_strength"];
    const posts = generateDynamicContent(productName, profile, healthFocus);
    onContentGenerated(posts);
    toast.success(`Generated ${posts.length} personalized posts for ${segmentLabels[profile.segment]}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>👥 User Segment Management</CardTitle>
          <CardDescription>
            Select user profiles to generate personalized content for different audience segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className={`cursor-pointer transition-colors ${selectedProfile?.id === profile.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedProfile(profile)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">
                        {segmentLabels[profile.segment]}
                      </Badge>
                      {profile.dogBreed && (
                        <span className="text-xs text-muted-foreground">
                          {profile.dogBreed} • {profile.dogAge}mo
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium">Interests:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Preferred Platforms:</Label>
                      <div className="flex gap-1 mt-1">
                        {profile.preferences.socialPlatforms.map((platform, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs capitalize">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateContent(profile);
                      }}
                    >
                      Generate Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Profile: {segmentLabels[selectedProfile.segment]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Content Preferences:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProfile.preferences.contentType.map((type, idx) => (
                    <Badge key={idx} variant="secondary">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Personalization Strategy:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedProfile.segment === 'new_puppy_owner' && (
                    <>
                      <li>• Focus on educational content and reassuring messaging</li>
                      <li>• Emphasize safety and proven benefits</li>
                      <li>• Include success stories from other new owners</li>
                    </>
                  )}
                  {selectedProfile.segment === 'experienced_owner' && (
                    <>
                      <li>• Highlight advanced nutritional benefits</li>
                      <li>• Compare with premium alternatives</li>
                      <li>• Focus on scientific backing</li>
                    </>
                  )}
                  {selectedProfile.segment === 'veterinarian' && (
                    <>
                      <li>• Emphasize clinical studies and research</li>
                      <li>• Include ingredient analysis</li>
                      <li>• Highlight professional endorsements</li>
                    </>
                  )}
                  {selectedProfile.segment === 'breeder' && (
                    <>
                      <li>• Focus on breeding program benefits</li>
                      <li>• Highlight puppy development outcomes</li>
                      <li>• Include testimonials from other breeders</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}