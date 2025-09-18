import { CampaignConfig } from "@/components/CampaignSidebar";

export interface CampaignResult {
  sku: string;
  language: string;
  campaign: string;
  businessUnit: string;
  segment: string;
  petType: string;
  brandVoice: string;
  tone: string;
  description: string;
  seoKeywords: string;
  hashtags: string;
  complianceIssues: string;
  imageUrl?: string;
  date: string;
}

// Simulate text cleaning and keyword extraction
export function cleanText(text: string): string {
  if (!text) return "";
  return text.replace(/\n/g, ' ').trim();
}

export function generateSEOKeywords(text: string, analyticKeywords?: string): string {
  // Simple keyword extraction simulation
  const words = text.toLowerCase().split(/\W+/).filter(word => 
    word.length > 3 && 
    !['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'].includes(word)
  );
  
  const wordCounts: { [key: string]: number } = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  let keywords = topWords;
  if (analyticKeywords) {
    keywords = [...new Set([...keywords, ...analyticKeywords.split(',').map(k => k.trim())])];
  }
  
  return keywords.join(', ');
}

export function validateCompliance(description: string, regions: string[]): string[] {
  const issues: string[] = [];
  
  if (description.toLowerCase().includes('miracle') && regions.includes('EU')) {
    issues.push("EU: 'Miracle' is not allowed in health claims.");
  }
  
  if (description.toLowerCase().includes('cure') && regions.includes('US')) {
    issues.push("US: Avoid 'cure' claims.");
  }
  
  if (description.toLowerCase().includes('guaranteed') && regions.includes('EU')) {
    issues.push("EU: 'Guaranteed' requires substantiation.");
  }
  
  if (description.toLowerCase().includes('best') && regions.includes('APAC')) {
    issues.push("APAC: Superlative claims need comparative evidence.");
  }
  
  return issues;
}

export async function generateCampaignContent(
  productName: string,
  category: string,
  ingredients: string,
  benefits: string,
  price: string,
  config: CampaignConfig,
  language: string,
  analyticKeywords?: string,
  feedbackText?: string,
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    // Generate fallback content without API
    const langSuffix = language !== 'EN' ? ` (${language})` : '';
    return `${config.tone} marketing content for ${config.petType} owners${langSuffix}! 
    
${productName} delivers exceptional ${benefits} for your beloved pet. Our ${category} features premium ${ingredients} at ${price}. 

Perfect for ${config.segment} who want the best nutrition. ${config.brandVoice} approach ensures your pet thrives with every meal! 

Campaign: ${config.campaignName} | ${config.defaultHashtags}

${feedbackText ? `Based on customer feedback: "${feedbackText}"` : ''}`;
  }

  const prompt = `Act as a marketing expert and generate ${config.tone} campaign content (language: ${language}) for ${config.petType} food.
Business Unit: ${config.businessUnit} | Campaign: ${config.campaignName} | Segment: ${config.segment}.
Product name: ${productName}. Category: ${category}.
Ingredients: ${ingredients}. Benefits: ${benefits}. Price info: ${price}.
Brand guidance: ${config.brandVoice}.
Analytics: seo_keywords: ${analyticKeywords || ''}.
User feedback: ${feedbackText || ''}.
Output as a creative marketing description and Instagram post.
Use these hashtags: ${config.defaultHashtags}.
Ensure the content complies for regions: ${config.regions.join(', ')}.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "Custom content generated!";
  } catch (error) {
    console.error("Error generating content:", error);
    // Return fallback content
    const langSuffix = language !== 'EN' ? ` (${language})` : '';
    return `${config.tone} marketing content for ${config.petType} owners${langSuffix}! ${productName} delivers exceptional nutrition. ${config.defaultHashtags}`;
  }
}

export async function generateCampaignImage(
  prompt: string,
  apiKey: string = "demo-key"
): Promise<string> {
  // Simulate image generation API call
  // In real implementation, this would call an actual image generation API
  try {
    // Mock API response with placeholder image
    const mockImageUrl = `https://picsum.photos/512/512?random=${Math.random()}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockImageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return "";
  }
}