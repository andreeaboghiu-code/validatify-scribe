import { SEOKeyword } from "@/types/product";

// Puppy food SEO keywords based on research
const puppyFoodKeywords: SEOKeyword[] = [
  { keyword: "best dog food for puppies", searchVolume: 3200, difficulty: "high", category: "general", intent: "commercial" },
  { keyword: "dog food for gut health", searchVolume: 800, difficulty: "medium", category: "health", intent: "informational" },
  { keyword: "puppy food for bone strength", searchVolume: 500, difficulty: "low", category: "health", intent: "commercial" },
  { keyword: "gut healthy puppy food", searchVolume: 300, difficulty: "low", category: "health", intent: "commercial" },
  { keyword: "puppy digestive health food", searchVolume: 250, difficulty: "low", category: "health", intent: "informational" },
  { keyword: "bone development puppy nutrition", searchVolume: 180, difficulty: "low", category: "health", intent: "informational" },
  { keyword: "probiotic puppy food", searchVolume: 400, difficulty: "medium", category: "health", intent: "commercial" },
  { keyword: "calcium rich puppy food", searchVolume: 220, difficulty: "low", category: "nutrition", intent: "commercial" },
];

export function generateSEOKeywords(
  productName: string, 
  category: string, 
  healthFocus: string[]
): SEOKeyword[] {
  const baseKeywords = [...puppyFoodKeywords];
  
  // Add dynamic keywords based on product specifics
  const dynamicKeywords: SEOKeyword[] = [];
  
  if (healthFocus.includes('gut_health')) {
    dynamicKeywords.push(
      { keyword: `${productName.toLowerCase()} gut health`, searchVolume: 150, difficulty: "low", category: "branded", intent: "commercial" },
      { keyword: "puppy digestive support", searchVolume: 180, difficulty: "low", category: "health", intent: "informational" }
    );
  }
  
  if (healthFocus.includes('bone_strength')) {
    dynamicKeywords.push(
      { keyword: `${productName.toLowerCase()} bone development`, searchVolume: 120, difficulty: "low", category: "branded", intent: "commercial" },
      { keyword: "puppy joint health food", searchVolume: 200, difficulty: "medium", category: "health", intent: "commercial" }
    );
  }
  
  return [...baseKeywords, ...dynamicKeywords]
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 15);
}

export function generateMetaDescription(productName: string, healthFocus: string[]): string {
  const benefits = healthFocus.map(focus => {
    switch(focus) {
      case 'gut_health': return 'digestive wellness';
      case 'bone_strength': return 'strong bones & joints';
      case 'immune_support': return 'immune system support';
      default: return focus.replace('_', ' ');
    }
  }).join(' & ');
  
  return `Discover ${productName} - premium puppy food specially formulated for ${benefits}. Vet-approved nutrition for healthy growth. Shop now!`;
}