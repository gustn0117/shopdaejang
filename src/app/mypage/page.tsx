import Link from "next/link";

export const metadata = { title: "마이페이지" };

const STATS = [
  { label: "내 매물", value: "3", href: "/mypage/listings", color: "bg-primary-light text-primary" },
  { label: "노출중", value: "2", href: "/mypage/listings?status=active", color: "bg-emerald-50 text-emerald-700" },
  { label: "승인대기", value: "1", href: "/mypage/listings?status=pending", color: "bg-amber-50 text-amber-700" },
  { label: "찜한매물", value: "12", href: "/mypage/favorites", color: "bg-pink-50 text-pink-700" },
];

export default function MyPage() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 lg:p-8 text-white">
        <p className="text-sm opacity-80">샵대장님 환영합니다</p>
        <h1 className="text-xl lg:text-2xl font-black mt-1">
          마이페이지에 오신 것을 환영합니다 👋
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="text-2xl lg:text-3xl font-black mt-1">{s.value}</p>
            <span className={`inline-block px-2 py-0.5 mt-2 text-[10px] font-bold rounded ${s.color}`}>
              자세히 →
            </span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">최근 매물</h2>
            <Link href="/mypage/listings" className="text-xs text-muted hover:text-primary">더보기 →</Link>
          </div>
          <ul className="space-y-2">
            {[
              { id: 1, title: "강남 신축 마사지샵 권리인하 급매", tier: "긴급", status: "노출중", views: 234 },
              { id: 2, title: "수원 우량 스웨디시 매장 양도", tier: "프리미엄", status: "승인대기", views: 0 },
              { id: 3, title: "부산 영도 아로마샵 매매", tier: "일반", status: "노출중", views: 89 },
            ].map((l) => (
              <li key={l.id} className="border border-border rounded-lg p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary text-white rounded">{l.tier}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.status === "노출중" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {l.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-1">{l.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">조회 {l.views}</p>
                  </div>
                  <Link href={`/mypage/listings/${l.id}`} className="text-[11px] text-primary shrink-0">
                    관리 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">최근 결제내역</h2>
            <Link href="/mypage/payments" className="text-xs text-muted hover:text-primary">더보기 →</Link>
          </div>
          <ul className="space-y-2">
            {[
              { id: 1, item: "긴급매물 1개월", amount: 90000, date: "2026.05.01" },
              { id: 2, item: "프리미엄 3개월", amount: 90000, date: "2026.04.20" },
              { id: 3, item: "일반 1개월", amount: 30000, date: "2026.04.10" },
            ].map((p) => (
              <li key={p.id} className="flex items-center justify-between border border-border rounded-lg p-2.5">
                <div>
                  <p className="text-xs font-semibold">{p.item}</p>
                  <p className="text-[10px] text-muted">{p.date}</p>
                </div>
                <span className="font-black text-sm">{p.amount.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-bold mb-1">📢 매물 관련 알림</p>
        <ul className="text-xs space-y-1 text-amber-900">
          <li>· 강남 신축 마사지샵의 광고 기간이 7일 남았습니다. 연장하시려면 결제 페이지로 이동해주세요.</li>
          <li>· 부산 영도 아로마샵에 새로운 찜 알림이 3건 등록되었습니다.</li>
        </ul>
      </div>
    </div>
  );
}
