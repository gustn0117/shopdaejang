import { SAMPLE_LISTINGS } from "@/lib/data";
import { MapView } from "@/components/MapView";

export const metadata = {
  title: "지도검색",
  description: "지도에서 마사지샵 매물을 찾아보세요",
};

export default function MapPage() {
  const listings = SAMPLE_LISTINGS.slice(0, 30);
  return (
    <div className="container-custom py-4 lg:py-6">
      <div className="mb-3">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight">지도검색</h1>
        <p className="text-xs lg:text-sm text-muted mt-1">
          지도에서 매물 위치를 한눈에 확인하세요
        </p>
      </div>
      <MapView listings={listings} />
    </div>
  );
}
