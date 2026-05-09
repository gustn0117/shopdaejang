// Seed sample data into Supabase via direct PostgREST. Run: `node scripts/seed.mjs`.
const URL = "https://api.hsweb.pics";
const SR_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.xTNteRFphY3F9W2PPWOwCQ9PDXD05ySRqkJu5d4Cej0";
const SCHEMA = "shopdaejang";

async function rest(method, path, body) {
  const res = await fetch(`${URL}/rest/v1${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Content-Profile": SCHEMA,
      "Accept-Profile": SCHEMA,
      apikey: SR_KEY,
      Authorization: `Bearer ${SR_KEY}`,
      Prefer: "return=minimal",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  }
}

const REGIONS_KEYS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "강원", "경북", "경남", "제주", "충북", "충남", "전북", "전남"];
const CATEGORIES = ["마사지샵", "스웨디시", "스포츠", "아로마", "타이", "중국", "전통", "베트남", "경락", "피부관리실", "토탈샵", "기타샵"];
const TIERS = ["urgent", "premium", "normal", "free"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeListings(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const sido = rand(REGIONS_KEYS);
    const tier = TIERS[i % 4];
    out.push({
      title: "이곳에 제목이 들어갑니다.",
      description: "이곳에 매물 설명이 들어갑니다.",
      shop_structure: "이곳에 샵 구조 설명이 들어갑니다.",
      commercial: "이곳에 상권 설명이 들어갑니다.",
      etc: "이곳에 기타 정보가 들어갑니다.",
      sido,
      sigungu: "강남구",
      dong: "역삼동",
      is_address_public: i % 5 !== 0,
      category: rand(CATEGORIES),
      area: 25 + ((i * 7) % 60),
      deposit: 1000,
      monthly_rent: 100,
      premium: 500,
      tier,
      thumbnail: null,
      images: [],
      phone: "010-0000-0000",
      use_secret_number: true,
      status: "approved",
      is_public: true,
      views: 50 + ((i * 19) % 500),
      favorites: ((i * 7) % 60),
      created_at: new Date(Date.now() - i * 36e5 * 8).toISOString(),
      bumped_at: new Date(Date.now() - i * 36e5 * 4).toISOString(),
    });
  }
  return out;
}

const NOTICES = [
  { title: "[필독] 사기 매물 신고 안내", content: "최근 보증금 선입금을 요구하는 사기 시도가 보고되었습니다. 반드시 현장 방문 후 거래해주세요.", is_pinned: true, views: 1230 },
  { title: "광고 상품 가격 일부 인하", content: "긴급매물 1개월 광고 상품의 가격이 인하되었습니다.", is_pinned: true, views: 850 },
  { title: "매물 검수 시간 단축", content: "관리자 검수 시간이 평균 2~6시간으로 단축되었습니다.", is_pinned: false, views: 612 },
  { title: "용품도매장터 오픈", content: "마사지샵 운영에 필요한 용품 도매가 시작되었습니다.", is_pinned: false, views: 480 },
  { title: "안심번호 서비스 개선", content: "050 안심번호 서비스의 안정성이 개선되었습니다.", is_pinned: false, views: 320 },
  { title: "5월 정기 점검 안내", content: "5월 12일 새벽 03:00~04:00 정기 점검이 있습니다.", is_pinned: false, views: 190 },
];

const USED = [
  { category: "팝니다", title: "이곳에 제목이 들어갑니다.", description: "이곳에 상품 설명이 들어갑니다.", price: 100000, region: "서울 강남", thumbnail: null, views: 87, is_completed: false, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { category: "팝니다", title: "이곳에 제목이 들어갑니다.", description: "이곳에 상품 설명이 들어갑니다.", price: 100000, region: "경기 수원", thumbnail: null, views: 56, is_completed: false, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { category: "삽니다", title: "이곳에 제목이 들어갑니다.", description: "이곳에 상품 설명이 들어갑니다.", price: 100000, region: "부산 해운대", thumbnail: null, views: 23, is_completed: false, created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
  { category: "팝니다", title: "이곳에 제목이 들어갑니다.", description: "이곳에 상품 설명이 들어갑니다.", price: 100000, region: "인천 부평", thumbnail: null, views: 134, is_completed: true, created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { category: "팝니다", title: "이곳에 제목이 들어갑니다.", description: "이곳에 상품 설명이 들어갑니다.", price: 100000, region: "대전 둔산", thumbnail: null, views: 41, is_completed: false, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const FAQS = [
  { category: "이용", question: "회원가입은 어떻게 하나요?", answer: "네이버/카카오/구글 SNS 계정으로 1초 만에 가입하실 수 있습니다.", sort_order: 1 },
  { category: "이용", question: "비회원으로도 매물을 볼 수 있나요?", answer: "매물 열람은 비회원도 가능하지만 등록·찜·문의는 회원가입이 필요합니다.", sort_order: 2 },
  { category: "광고", question: "광고비는 환불 가능한가요?", answer: "노출 시작 전까지 100% 환불 가능하며, 시작 후에는 잔여 기간 안분 환불됩니다.", sort_order: 3 },
  { category: "광고", question: "유료 매물은 자동 점프되나요?", answer: "긴급/프리미엄/일반 상품은 1시간마다 자동 점프되어 상위에 노출됩니다.", sort_order: 4 },
  { category: "거래", question: "직거래만 가능한가요?", answer: "네, 샵대장은 직거래 광고 플랫폼입니다. 회사는 거래에 직접 개입하지 않습니다.", sort_order: 5 },
  { category: "거래", question: "사기 매물 신고는 어떻게 하나요?", answer: "매물 상세 페이지의 '매물 신고하기' 버튼으로 신고할 수 있습니다.", sort_order: 6 },
  { category: "결제", question: "어떤 결제 수단을 지원하나요?", answer: "신용카드, 계좌이체, 카카오페이, 네이버페이를 지원합니다.", sort_order: 7 },
  { category: "결제", question: "세금계산서 발행 가능한가요?", answer: "사업자 회원 전환 후 결제 페이지에서 세금계산서 신청이 가능합니다.", sort_order: 8 },
];

async function main() {
  // Clear existing
  for (const t of ["listings", "notices", "used_goods", "faqs"]) {
    await rest("DELETE", `/${t}?id=gte.0`);
  }

  await rest("POST", "/listings", makeListings(80));
  console.log("listings: 80");
  await rest("POST", "/notices", NOTICES);
  console.log("notices:", NOTICES.length);
  await rest("POST", "/used_goods", USED);
  console.log("used_goods:", USED.length);
  await rest("POST", "/faqs", FAQS);
  console.log("faqs:", FAQS.length);

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
