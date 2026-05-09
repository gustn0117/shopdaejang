export type AdTier = "urgent" | "premium" | "normal" | "free";

export type ShopCategory =
  | "마사지샵"
  | "스웨디시"
  | "스포츠"
  | "아로마"
  | "타이"
  | "중국"
  | "전통"
  | "베트남"
  | "경락"
  | "피부관리실"
  | "토탈샵"
  | "기타샵";

export type Region = {
  sido: string;
  sigungu?: string;
  dong?: string;
};

export type Listing = {
  id: number;
  title: string;
  category: ShopCategory;
  region: string;
  sido: string;
  sigungu: string;
  dong?: string;
  area: number;
  deposit: number;
  monthlyRent: number;
  premium: number;
  description: string;
  shopStructure?: string;
  commercialArea?: string;
  etcInfo?: string;
  phone: string;
  useSecretNumber: boolean;
  images: string[];
  thumbnail: string;
  tier: AdTier;
  status: "pending" | "approved" | "rejected" | "expired" | "sold";
  isPublic: boolean;
  isAddressPublic: boolean;
  views: number;
  favorites: number;
  createdAt: string;
  expiresAt?: string;
  bumpedAt: string;
};

export type UsedGood = {
  id: number;
  title: string;
  category: "팝니다" | "삽니다";
  price: number;
  region: string;
  thumbnail: string;
  description: string;
  isCompleted: boolean;
  views: number;
  createdAt: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  views: number;
  createdAt: string;
};

export type FAQ = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

export type AdPricing = {
  tier: AdTier;
  label: string;
  description: string;
  prices: { period: string; price: number; isFeatured?: boolean }[];
  benefits: string[];
};
