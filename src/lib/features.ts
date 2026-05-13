export type ListingFeature = {
  key: string;
  label: string;
};

export const LISTING_FEATURES: ListingFeature[] = [
  { key: "no_maintenance", label: "관리비없음" },
  { key: "cctv", label: "CCTV설치" },
  { key: "inner_toilet", label: "내부화장실" },
  { key: "shower", label: "샤워실" },
  { key: "free_parking", label: "무료주차" },
  { key: "elevator", label: "엘리베이터" },
  { key: "hvac", label: "냉난방 시설" },
  { key: "sleep_room", label: "개인수면실" },
  { key: "lounge", label: "대기실/휴게실" },
  { key: "laundry", label: "세탁기/건조기" },
  { key: "pantry", label: "탕비실/주방" },
  { key: "24h", label: "24시간운영" },
  { key: "door_lock", label: "도어락/출입통제" },
  { key: "remodel", label: "리모델링" },
];

export const FEATURE_LABEL: Record<string, string> = Object.fromEntries(
  LISTING_FEATURES.map((f) => [f.key, f.label])
);
