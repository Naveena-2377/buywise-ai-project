
import { GoogleGenAI, Type } from "@google/genai";
import { ProductListing, AnalysisSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const normalizeScore = (score: any): number => {
  if (score === undefined || score === null || isNaN(Number(score))) return 0;
  const num = Number(score);
  if (num > 0 && num <= 1) {
    return Math.min(100, Math.max(0, Math.round(num * 100)));
  }
  return Math.min(100, Math.max(0, Math.round(num)));
};

const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const cleaned = text.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleaned);
  }
};

export const analyzeProductSearch = async (query: string, preferredPlatform?: string): Promise<{ listings: ProductListing[], summary: AnalysisSummary }> => {
  const isStrictPlatform = preferredPlatform && preferredPlatform !== 'All';
  
  const platformContext = isStrictPlatform 
    ? `CRITICAL: ONLY return listings from ${preferredPlatform}. DO NOT include any other merchants.` 
    : "Find the most relevant and best value deals across Amazon.in, Flipkart, Reliance Digital, Croma, and Tata CLiQ. Provide a diverse mix of retailers.";

  const prompt = `
    Find the 6 best seller listings for "${query}" in India.
    Context: ${platformContext}
    
    Listing Requirements:
    - The 'merchant' field must be accurately set to the store name (e.g., 'Amazon', 'Flipkart', 'Reliance Digital', 'Croma', 'Tata CLiQ').
    - If ${preferredPlatform || 'a store'} is selected, you MUST prioritize direct product URLs if known, otherwise use search result URLs.
    - 'sentimentScore' and 'popularityIndex' must be 0-100 integers representing real market data.
    - Provide realistic 'price' and 'originalPrice' in INR.
    
    Output JSON only matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                bestFeature: { type: Type.STRING },
                totalListingsAnalyzed: { type: Type.NUMBER },
                aiVerdict: { type: Type.STRING }
              },
              required: ["productName", "bestFeature", "totalListingsAnalyzed", "aiVerdict"]
            },
            listings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  merchant: { type: Type.STRING },
                  sellerName: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  originalPrice: { type: Type.NUMBER },
                  rating: { type: Type.NUMBER },
                  reviewsCount: { type: Type.NUMBER },
                  sentimentScore: { type: Type.NUMBER },
                  sellerTrustScore: { type: Type.NUMBER },
                  popularityIndex: { type: Type.NUMBER },
                  priceStability: { type: Type.STRING },
                  deliveryTime: { type: Type.STRING },
                  url: { type: Type.STRING },
                  buyScore: { type: Type.NUMBER },
                  isOfficial: { type: Type.BOOLEAN }
                },
                required: ["id", "merchant", "sellerName", "price", "url"]
              }
            }
          }
        }
      }
    });

    const data = safeJsonParse(response.text || '{}');
    
    if (!data.listings || !Array.isArray(data.listings)) {
      throw new Error("Failed to parse market listings.");
    }

    const filteredListings = isStrictPlatform 
      ? data.listings.filter((l: any) => l.merchant.toLowerCase().includes(preferredPlatform.toLowerCase()))
      : data.listings;

    const processedListings = filteredListings.map((l: any, idx: number) => {
      const merchantLower = (l.merchant || '').toLowerCase();
      let fallbackUrl = l.url;

      // Ensure a valid URL for the specific merchant
      if (!fallbackUrl || !fallbackUrl.startsWith('http')) {
          if (merchantLower.includes('amazon')) {
            fallbackUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
          } else if (merchantLower.includes('flipkart')) {
            fallbackUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
          } else if (merchantLower.includes('reliance')) {
            fallbackUrl = `https://www.reliancedigital.in/search?q=${encodeURIComponent(query)}:relevance`;
          } else if (merchantLower.includes('croma')) {
            fallbackUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}:relevance`;
          } else if (merchantLower.includes('cliq')) {
            fallbackUrl = `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(query)}`;
          } else {
            fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' ' + (l.merchant || ''))}&tbm=shop`;
          }
      }

      return {
        ...l,
        id: l.id || `listing-${idx}-${Date.now()}`,
        sentimentScore: normalizeScore(l.sentimentScore || l.rating * 20 || 80),
        buyScore: normalizeScore(l.buyScore || 75),
        sellerTrustScore: normalizeScore(l.sellerTrustScore || 70),
        popularityIndex: normalizeScore(l.popularityIndex || 50),
        url: fallbackUrl
      };
    });

    if (processedListings.length === 0 && isStrictPlatform) {
      throw new Error(`We couldn't find specific listings for "${query}" on ${preferredPlatform}. Try "All" stores for a wider search.`);
    }

    const sorted = [...processedListings].sort((a, b) => (b.sentimentScore + b.popularityIndex) - (a.sentimentScore + a.popularityIndex));
    if (sorted.length > 0) sorted[0].isWinner = true;

    return { 
      listings: sorted, 
      summary: {
        productName: data.summary?.productName || query,
        bestFeature: data.summary?.bestFeature || 'Market Availability',
        totalListingsAnalyzed: data.summary?.totalListingsAnalyzed || processedListings.length,
        aiVerdict: data.summary?.aiVerdict || `Showing top ${processedListings.length} deals from across the Indian market.`
      } 
    };
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("Could not analyze deals. Try a different search.");
  }
};
