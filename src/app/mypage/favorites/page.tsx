import { createClient } from "@/lib/supabase/server";
import { PremiumCard } from "@/components/ListingCard";
import { fetchListings } from "@/lib/db";
import type { Listing } from "@/lib/types";

export const metadata = { title: "찜한 매물" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let favs: Listing[] = [];
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id);
    const ids = (data ?? []).map((r: { listing_id: number }) => r.listing_id);
    if (ids.length) {
      const all = await fetchListings({ limit: 100 });
      favs = all.filter((l) => ids.includes(l.id));
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg lg:text-xl font-black tracking-tight">찜한 매물</h1>
        <p className="text-xs lg:text-sm text-muted mt-1">관심있게 본 매물 목록입니다</p>
      </div>
      {favs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
          {favs.map((l) => <PremiumCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <div className="bg-white rounded-md border border-border p-12 text-center text-sm text-muted">
          찜한 매물이 없습니다.
        </div>
      )}
    </div>
  );
}
