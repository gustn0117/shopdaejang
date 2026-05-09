import { SAMPLE_LISTINGS } from "@/lib/data";
import { PremiumCard } from "@/components/ListingCard";

export const metadata = { title: "찜한 매물" };

export default function FavoritesPage() {
  const favs = SAMPLE_LISTINGS.slice(2, 14);
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg lg:text-xl font-black">찜한 매물</h1>
        <p className="text-xs lg:text-sm text-muted mt-1">관심있게 본 매물 목록입니다</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
        {favs.map((l) => <PremiumCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
}
