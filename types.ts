
export interface ProductListing {
  id: string;
  merchant: string; // The platform (e.g., Amazon, Flipkart)
  sellerName: string; // The specific seller (e.g., Appario Retail, RetailNet)
  merchantLogo: string;
  imageUrl: string; // URL for the product picture
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  sentimentScore: number; // 0 to 100
  sellerTrustScore: number; // 0 to 100
  popularityIndex: number; // 0 to 100
  priceStability: 'Increasing' | 'Stable' | 'Decreasing';
  deliveryTime: string;
  url: string;
  isWinner?: boolean;
  buyScore: number;
  isOfficial?: boolean;
}

export interface AnalysisSummary {
  productName: string;
  bestFeature: string;
  totalListingsAnalyzed: number;
  aiVerdict: string;
}
