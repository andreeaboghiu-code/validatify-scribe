import { DataRecord } from "@/types/data";

export async function generateProductDescription(
  productName: string,
  category: string,
  apiKey: string
): Promise<string> {
  const prompt = `Write a short, engaging product description for a ${category} called ${productName}.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate description");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "Description not available";
}

export async function generateDescriptionsForAllProducts(
  products: DataRecord[],
  apiKey: string,
  onProgress?: (current: number, total: number) => void
): Promise<DataRecord[]> {
  const enrichedProducts: DataRecord[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    onProgress?.(i + 1, products.length);

    try {
      const description = await generateProductDescription(
        product.product_name,
        product.category,
        apiKey
      );

      enrichedProducts.push({
        ...product,
        description,
      });

      // Add a small delay to avoid rate limiting
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Failed to generate description for ${product.product_name}:`, error);
      enrichedProducts.push({
        ...product,
        description: "Failed to generate description",
      });
    }
  }

  return enrichedProducts;
}