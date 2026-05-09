import type { Listing, UsedGood, Notice, FAQ, AdPricing, ShopCategory } from "./types";

export const CATEGORIES: ShopCategory[] = [
  "마사지샵",
  "스웨디시",
  "스포츠",
  "아로마",
  "타이",
  "중국",
  "전통",
  "베트남",
  "경락",
  "피부관리실",
  "토탈샵",
  "기타샵",
];

export const REGIONS = {
  서울: ["강남구", "서초구", "송파구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "성동구", "성북구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  경기: ["수원시", "용인시", "고양시", "성남시", "부천시", "화성시", "안산시", "안양시", "남양주시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시", "광주시", "군포시", "하남시", "오산시", "양주시", "이천시", "구리시"],
  인천: ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  부산: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  대전: ["동구", "중구", "서구", "유성구", "대덕구"],
  광주: ["동구", "서구", "남구", "북구", "광산구"],
  울산: ["중구", "남구", "동구", "북구", "울주군"],
  세종: ["세종시"],
  강원: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시"],
  충북: ["청주시", "충주시", "제천시"],
  충남: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "당진시"],
  전북: ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시"],
  전남: ["목포시", "여수시", "순천시", "나주시", "광양시"],
  경북: ["포항시", "경주시", "김천시", "안동시", "구미시"],
  경남: ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시"],
  제주: ["제주시", "서귀포시"],
};

const PALETTES = [
  ["#fef3c7", "#fbbf24", "#92400e"],
  ["#dbeafe", "#3b82f6", "#1e3a8a"],
  ["#fce7f3", "#ec4899", "#831843"],
  ["#dcfce7", "#22c55e", "#14532d"],
  ["#ede9fe", "#8b5cf6", "#4c1d95"],
  ["#ffe4e6", "#f43f5e", "#881337"],
  ["#cffafe", "#06b6d4", "#164e63"],
  ["#fef2f2", "#ef4444", "#7f1d1d"],
  ["#f3f4f6", "#475569", "#0f172a"],
  ["#fff7ed", "#f97316", "#7c2d12"],
];

function makePlaceholder(idx: number, label: string): string {
  const [bg, accent, text] = PALETTES[idx % PALETTES.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${bg}'/><stop offset='100%' stop-color='${accent}' stop-opacity='0.6'/></linearGradient></defs><rect width='600' height='400' fill='url(%23g)'/><circle cx='480' cy='80' r='60' fill='${accent}' opacity='0.4'/><circle cx='100' cy='340' r='50' fill='${accent}' opacity='0.3'/><rect x='180' y='160' width='240' height='120' rx='12' fill='white' opacity='0.55'/><text x='300' y='220' font-family='Apple SD Gothic Neo, sans-serif' font-size='30' font-weight='800' fill='${text}' text-anchor='middle'>${label}</text><text x='300' y='250' font-family='Apple SD Gothic Neo, sans-serif' font-size='14' fill='${text}' text-anchor='middle'>SHOP DAEJANG</text></svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/#/g, "%23")}`;
}

const SAMPLE_IMAGES = Array.from({ length: 12 }, (_, i) => makePlaceholder(i, "마사지샵"));

const desc = [
  "역세권 5분거리 우량매물",
  "오픈 6개월차 현재 운영중",
  "단골 다수 보유 안정적인 매장",
  "신축 인테리어 권리인하 가능",
  "급매물 빠른 거래 가능",
  "관리자 1+ 매니저 4 운영중",
  "관리자 직영 매장 양도",
  "역세권 1층 코너자리 매장",
  "주차 5대 보장 한적한 위치",
  "수입 안정적인 우량 매장 매매",
];

function pseudoRandom(seed: number, max: number): number {
  // Deterministic pseudo-random based on seed (avoids hydration mismatch)
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.floor((x - Math.floor(x)) * max);
}

function makeListing(
  id: number,
  tier: Listing["tier"],
  sido: keyof typeof REGIONS,
  sigungu: string,
  category: ShopCategory,
  daysAgo: number,
): Listing {
  const deposit = pseudoRandom(id + 1, 5000) + 1000;
  const monthlyRent = pseudoRandom(id + 2, 300) + 100;
  const premium = pseudoRandom(id + 3, 8000) + 1000;
  const area = pseudoRandom(id + 4, 60) + 20;
  const dateBase = new Date();
  dateBase.setDate(dateBase.getDate() - daysAgo);
  const titlePool = [
    `${sigungu} ${category} 양도양수 매물`,
    `${sigungu} 역세권 ${category} 매장 매매`,
    `${sigungu} 신축 ${category} 권리인하 급매`,
    `${sigungu} 우량 ${category} 매장 양도`,
    `${sigungu} 안정적인 ${category} 매물`,
    `${sigungu} 중심상권 ${category} 매매`,
  ];
  return {
    id,
    title: titlePool[id % titlePool.length],
    category,
    region: `${sido} ${sigungu}`,
    sido,
    sigungu,
    dong: undefined,
    area,
    deposit,
    monthlyRent,
    premium,
    description: desc[id % desc.length],
    phone: "010-0000-0000",
    useSecretNumber: id % 3 === 0,
    images: [SAMPLE_IMAGES[id % SAMPLE_IMAGES.length]],
    thumbnail: SAMPLE_IMAGES[id % SAMPLE_IMAGES.length],
    tier,
    status: "approved",
    isPublic: true,
    isAddressPublic: id % 4 !== 0,
    views: pseudoRandom(id + 5, 2000) + 50,
    favorites: pseudoRandom(id + 6, 80) + 1,
    createdAt: dateBase.toISOString(),
    bumpedAt: new Date(dateBase.getTime() + 1000 * 60 * 60).toISOString(),
  };
}

const sidoKeys = Object.keys(REGIONS) as (keyof typeof REGIONS)[];

function generateListings(): Listing[] {
  const list: Listing[] = [];
  let id = 50000;

  // 긴급매물 - 12 listings
  for (let i = 0; i < 12; i++) {
    const sido = sidoKeys[i % sidoKeys.length];
    const sigungu = REGIONS[sido][i % REGIONS[sido].length];
    const cat = CATEGORIES[i % CATEGORIES.length];
    list.push(makeListing(id++, "urgent", sido, sigungu, cat, i));
  }
  // 프리미엄 - 16 listings
  for (let i = 0; i < 16; i++) {
    const sido = sidoKeys[(i + 3) % sidoKeys.length];
    const sigungu = REGIONS[sido][i % REGIONS[sido].length];
    const cat = CATEGORIES[(i + 2) % CATEGORIES.length];
    list.push(makeListing(id++, "premium", sido, sigungu, cat, i + 1));
  }
  // 일반 - 20 listings
  for (let i = 0; i < 20; i++) {
    const sido = sidoKeys[(i + 5) % sidoKeys.length];
    const sigungu = REGIONS[sido][i % REGIONS[sido].length];
    const cat = CATEGORIES[(i + 4) % CATEGORIES.length];
    list.push(makeListing(id++, "normal", sido, sigungu, cat, i + 2));
  }
  // 무료 - 14 listings
  for (let i = 0; i < 14; i++) {
    const sido = sidoKeys[(i + 7) % sidoKeys.length];
    const sigungu = REGIONS[sido][i % REGIONS[sido].length];
    const cat = CATEGORIES[(i + 6) % CATEGORIES.length];
    list.push(makeListing(id++, "free", sido, sigungu, cat, i + 3));
  }
  return list;
}

export const SAMPLE_LISTINGS: Listing[] = generateListings();

export const SAMPLE_USED_GOODS: UsedGood[] = [
  {
    id: 1,
    title: "마사지베드 거의새것 전동베드 양도합니다",
    category: "팝니다",
    price: 350000,
    region: "서울 강남구",
    thumbnail: makePlaceholder(1, "마사지베드"),
    description: "전동베드 6개월 사용 거의 새것입니다.",
    isCompleted: false,
    views: 234,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    title: "타올 도매가 양도합니다 200장",
    category: "팝니다",
    price: 80000,
    region: "경기 수원시",
    thumbnail: makePlaceholder(2, "타올"),
    description: "신상 타올 200장 도매가에 넘깁니다.",
    isCompleted: true,
    views: 567,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 3,
    title: "중고 마사지오일 일괄로 구매 원합니다",
    category: "삽니다",
    price: 100000,
    region: "인천 남동구",
    thumbnail: makePlaceholder(3, "마사지오일"),
    description: "마사지오일 미사용품 또는 80%이상 잔량 일괄 매입 원합니다.",
    isCompleted: false,
    views: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 4,
    title: "전동안마기 새상품 양도",
    category: "팝니다",
    price: 250000,
    region: "서울 마포구",
    thumbnail: makePlaceholder(4, "안마기"),
    description: "오픈할 때 구입했으나 미사용 양도합니다.",
    isCompleted: false,
    views: 432,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 5,
    title: "샵 인테리어 소품 일괄 정리",
    category: "팝니다",
    price: 500000,
    region: "부산 해운대구",
    thumbnail: makePlaceholder(5, "인테리어"),
    description: "샵 폐업으로 인테리어 소품 일괄 정리합니다.",
    isCompleted: false,
    views: 1023,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 6,
    title: "타올 워머 새것급 판매",
    category: "팝니다",
    price: 180000,
    region: "경기 성남시",
    thumbnail: makePlaceholder(6, "타올워머"),
    description: "타올워머 6개월 사용 작동잘됨.",
    isCompleted: false,
    views: 156,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

export const SAMPLE_NOTICES: Notice[] = [
  {
    id: 1,
    title: "[중요] 2026년 운영 안내",
    content: "안녕하세요. 샵대장 운영진입니다.",
    isPinned: true,
    views: 2341,
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: 2,
    title: "[업데이트] 모바일 매물 등록 양식 UI 개선되었습니다",
    content: "모바일에서 매물 등록 시 더 빠르고 간편하게 등록할 수 있도록 양식을 개선했습니다.",
    isPinned: true,
    views: 1234,
    createdAt: "2026-05-03T14:30:00Z",
  },
  {
    id: 3,
    title: "사진 등록 기능이 개선되었습니다",
    content: "사진 등록 시 자동 압축 및 미리보기 기능을 추가했습니다.",
    isPinned: false,
    views: 891,
    createdAt: "2026-04-28T09:15:00Z",
  },
  {
    id: 4,
    title: "광고 상품 가격 안내",
    content: "광고 상품별 가격 및 노출 기준 안내드립니다.",
    isPinned: false,
    views: 1567,
    createdAt: "2026-04-20T11:00:00Z",
  },
  {
    id: 5,
    title: "사기 매물 신고 안내",
    content: "사기로 의심되는 매물 발견 시 신고 부탁드립니다.",
    isPinned: false,
    views: 678,
    createdAt: "2026-04-15T16:20:00Z",
  },
];

export const SAMPLE_FAQS: FAQ[] = [
  {
    id: 1,
    category: "회원가입/로그인",
    question: "회원가입은 어떻게 하나요?",
    answer: "네이버, 카카오, 구글 계정으로 간편 회원가입이 가능합니다. 별도 가입 절차 없이 소셜 로그인 한 번으로 회원가입이 완료됩니다.",
  },
  {
    id: 2,
    category: "매물 등록",
    question: "매물은 누구나 등록할 수 있나요?",
    answer: "회원가입 후 누구나 매물을 등록할 수 있습니다. 다만 등록한 매물은 관리자 승인 후 노출됩니다.",
  },
  {
    id: 3,
    category: "매물 등록",
    question: "매물 등록 후 얼마나 걸리나요?",
    answer: "관리자 검수는 영업일 기준 평균 2~6시간 이내 진행됩니다. 광고 결제가 완료된 매물부터 우선 검수됩니다.",
  },
  {
    id: 4,
    category: "광고/결제",
    question: "광고 상품의 차이는 무엇인가요?",
    answer: "긴급매물은 메인 최상단에 큰 썸네일과 함께 강조 노출되며, 프리미엄은 중간에 사진형으로, 일반은 텍스트 위주로 노출됩니다. 무료매물은 10일간 텍스트 노출됩니다.",
  },
  {
    id: 5,
    category: "광고/결제",
    question: "환불은 가능한가요?",
    answer: "광고 노출 시작 전까지는 100% 환불 가능합니다. 노출 시작 후에는 잔여 기간에 대해 안분 환불됩니다.",
  },
  {
    id: 6,
    category: "거래",
    question: "거래는 어떻게 이루어지나요?",
    answer: "샵대장은 광고 플랫폼이며 중개나 계약에 개입하지 않는 직거래 구조입니다. 매수자는 매물 페이지의 연락처로 매도자에게 직접 연락합니다.",
  },
  {
    id: 7,
    category: "거래",
    question: "안심번호란 무엇인가요?",
    answer: "안심번호는 본인 휴대폰 번호 대신 050으로 시작하는 가상번호로 노출되어 개인정보 노출 없이 안전하게 통화할 수 있는 서비스입니다.",
  },
  {
    id: 8,
    category: "기타",
    question: "사기로 의심되는 매물을 발견했어요",
    answer: "매물 상세 페이지의 신고 버튼을 통해 신고하거나, 고객센터로 연락주시면 즉시 검토 후 조치합니다.",
  },
];

export const AD_PRICING: AdPricing[] = [
  {
    tier: "urgent",
    label: "긴급매물",
    description: "메인 상단 큰 썸네일 강조 노출",
    prices: [
      { period: "1개월", price: 90000 },
      { period: "2개월", price: 119000 },
      { period: "3개월", price: 130000, isFeatured: true },
      { period: "팔릴 때까지", price: 170000 },
    ],
    benefits: [
      "메인 페이지 최상단 노출",
      "큰 썸네일 + 제목 강조",
      "1시간마다 자동 점프",
      "검색 결과 최상단",
      "긴급 라벨 표시",
    ],
  },
  {
    tier: "premium",
    label: "프리미엄",
    description: "중간 사진형 매물로 노출",
    prices: [
      { period: "1개월", price: 50000 },
      { period: "2개월", price: 79000 },
      { period: "3개월", price: 90000, isFeatured: true },
      { period: "팔릴 때까지", price: 130000 },
    ],
    benefits: [
      "메인 중단 사진 카드 노출",
      "1시간마다 자동 점프",
      "프리미엄 라벨 표시",
      "찜한 매물 알림 발송",
    ],
  },
  {
    tier: "normal",
    label: "일반",
    description: "메인 하단 텍스트 제목 노출",
    prices: [
      { period: "1개월", price: 30000 },
      { period: "2개월", price: 50000 },
      { period: "3개월", price: 70000, isFeatured: true },
    ],
    benefits: ["메인 하단 노출", "1시간마다 자동 점프", "지역별 모음 자동 노출"],
  },
  {
    tier: "free",
    label: "무료",
    description: "10일간 무료 노출",
    prices: [{ period: "10일", price: 0, isFeatured: true }],
    benefits: ["광고비 없음", "최하단 텍스트 노출", "10일 후 자동 만료"],
  },
];
