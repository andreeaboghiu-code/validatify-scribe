import { SocialMediaPost, UserProfile } from "@/types/product";

const instagramTemplates = {
  new_puppy_owner: [
    "🐾 New puppy parent? Your little one deserves the BEST start! Our {productName} supports healthy gut development and strong bones. Watch them thrive! 💪 #NewPuppyLife #HealthyPuppies #GutHealth",
    "✨ Puppy parenthood just got easier! {productName} is specially crafted for growing pups who need extra support for their tummies and bones. 🦴 #PuppyNutrition #HealthyGrowth #BoneStrong",
    "🌟 From tiny paws to strong bones! {productName} gives your puppy the gut health foundation they need for a lifetime of tail wags. 🐕 #PuppyWellness #DigestiveHealth #StrongBones"
  ],
  experienced_owner: [
    "🎯 You know quality when you see it. {productName} delivers targeted nutrition for gut health and bone development - because experience teaches you what matters most. 🧠 #QualityNutrition #ExpertChoice #PuppyHealth",
    "📊 The science is clear: early nutrition impacts lifelong health. {productName} provides research-backed support for digestive wellness and skeletal development. 🔬 #ScienceBased #PuppyNutrition #HealthFoundation"
  ],
  veterinarian: [
    "🏥 Vet-recommended nutrition starts early. {productName} offers clinically-formulated support for puppy gut microbiome and bone mineralization. Trust the science. 👩‍⚕️ #VetRecommended #ClinicalNutrition #PuppyHealth"
  ],
  breeder: [
    "🏆 Champion bloodlines deserve champion nutrition. {productName} provides the foundation for healthy gut development and strong skeletal formation in your precious puppies. 🥇 #BreederChoice #ChampionNutrition #HealthyPuppies"
  ]
};

const hashtagSets = {
  health_focused: ["#PuppyHealth", "#GutHealth", "#BoneStrong", "#HealthyPuppies", "#DigestiveWellness"],
  lifestyle: ["#PuppyLife", "#DogMom", "#DogDad", "#PuppyLove", "#NewPuppy"],
  nutrition: ["#PuppyNutrition", "#QualityFood", "#HealthyGrowth", "#PremiumNutrition", "#VetApproved"],
  engagement: ["#PuppyParents", "#HealthyDogs", "#DogCommunity", "#PuppyTips", "#DogWellness"]
};

export function generateInstagramPost(
  productName: string,
  userSegment: string,
  healthFocus: string[]
): SocialMediaPost {
  const templates = instagramTemplates[userSegment as keyof typeof instagramTemplates] || instagramTemplates.new_puppy_owner;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const content = template.replace(/{productName}/g, productName);
  
  // Select hashtags based on health focus
  let selectedHashtags: string[] = [...hashtagSets.engagement];
  
  if (healthFocus.includes('gut_health') || healthFocus.includes('bone_strength')) {
    selectedHashtags.push(...hashtagSets.health_focused);
  }
  selectedHashtags.push(...hashtagSets.lifestyle);
  selectedHashtags.push(...hashtagSets.nutrition);
  
  // Remove duplicates and limit to 15 hashtags
  const uniqueHashtags = [...new Set(selectedHashtags)].slice(0, 15);
  
  return {
    id: crypto.randomUUID(),
    platform: 'instagram',
    content,
    hashtags: uniqueHashtags,
    targetSegment: userSegment
  };
}

export function generateDynamicContent(
  productName: string,
  userProfile: UserProfile,
  healthFocus: string[]
): SocialMediaPost[] {
  const posts: SocialMediaPost[] = [];
  
  // Generate base post for user's segment
  posts.push(generateInstagramPost(productName, userProfile.segment, healthFocus));
  
  // Generate additional targeted content based on interests
  if (userProfile.interests.includes('training')) {
    const trainingPost: SocialMediaPost = {
      id: crypto.randomUUID(),
      platform: 'instagram',
      content: `🎾 Training tip: A healthy gut means better focus! ${productName} supports digestive wellness so your puppy can concentrate on learning. Smart nutrition for smart pups! 🧠 #PuppyTraining #SmartNutrition`,
      hashtags: ["#PuppyTraining", "#GutHealth", "#SmartPuppies", "#HealthyLearning", "#PuppyTips"],
      targetSegment: userProfile.segment
    };
    posts.push(trainingPost);
  }
  
  if (userProfile.interests.includes('exercise')) {
    const exercisePost: SocialMediaPost = {
      id: crypto.randomUUID(),
      platform: 'instagram',
      content: `🏃‍♀️ Active pups need strong foundations! ${productName} builds the bone strength your energetic puppy needs for all those zoomies. 💨 #ActivePuppies #BoneStrong`,
      hashtags: ["#ActiveDogs", "#BoneStrong", "#PuppyExercise", "#HealthyBones", "#EnergeticPups"],
      targetSegment: userProfile.segment
    };
    posts.push(exercisePost);
  }
  
  return posts;
}

export async function generateAISocialCopy(
  productName: string,
  targetAudience: string,
  healthFocus: string[],
  apiKey: string
): Promise<string> {
  const prompt = `Create an engaging Instagram post for ${productName}, a puppy food focused on ${healthFocus.join(' and ')}. Target audience: ${targetAudience}. Include relevant emojis and keep it under 150 characters.`;
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.8,
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to generate social media copy");
  }
  
  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "Custom content generated!";
}