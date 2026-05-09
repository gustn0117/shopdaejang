import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "마이페이지" };

const STATS = [
  { label: "내 매물", value: "3", href: "/mypage/listings" },
  { label: "노출중", value: "2", href: "/mypage/listings?status=active" },
  { label: "승인대기", value: "1", href: "/mypage/listings?status=pending" },
  { label: "찜한매물", value: "12", href: "/mypage/favorites" },
];

export default function MyPage() {
  return (
    <div className="space-y-4">
      <div className="bg-foreground rounded-md p-5 lg:p-8 text-white">
        <p className="text-sm text-white/70">샵대장님 환영합니다</p>
        <h1 className="text-xl lg:text-2xl font-black mt-1 tracking-tight">
          마이페이지
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-md border border-border p-4 hover:border-foreground transition-colors">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="text-2xl lg:text-3xl font-black mt-1">{s.value}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-muted">
              자세히
              <Icon.ChevronRight size={10} />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-md border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">최근 매물</h2>
            <Link href="/mypage/listings" className="inline-flex items-center gap-0.5 text-xs text-muted hover:text-foreground">
              더보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          <ul className="space-y-2">
            {[
              { id: 1, title: "강남 신축 마사지샵 권리인하 급매", tier: "긴급", status: "노출중", views: 234 },
              { id: 2, title: "수원 우량 스웨디시 매장 양도", tier: "프리미엄", status: "승인대기", views: 0 },
              { id: 3, title: "부산 영도 아로마샵 매매", tier: "일반", status: "노출중", views: 89 },
            ].map((l) => (
              <li key={l.id} className="border border-border rounded p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-foreground text-white rounded">{l.tier}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.status === "노출중" ? "bg-free text-white" : "bg-zinc-200 text-foreground"}`}>
                        {l.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-1">{l.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">조회 {l.views}</p>
                  </div>
                  <Link href={`/mypage/listings/${l.id}`} className="inline-flex items-center gap-0.5 text-[11px] text-foreground shrink-0">
                    관리
                    <Icon.ChevronRight size={10} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-md border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">최근 결제내역</h2>
            <Link href="/mypage/payments" className="inline-flex items-center gap-0.5 text-xs text-muted hover:text-foreground">
              더보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          <ul className="space-y-2">
            {[
              { id: 1, item: "긴급매물 1개월", amount: 90000, date: "2026.05.01" },
              { id: 2, item: "프리미엄 3개월", amount: 90000, date: "2026.04.20" },
              { id: 3, item: "일반 1개월", amount: 30000, date: "2026.04.10" },
            ].map((p) => (
              <li key={p.id} className="flex items-center justify-between border border-border rounded p-2.5">
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

      <div className="bg-zinc-50 border border-border rounded p-4">
        <p className="text-sm font-bold mb-1 inline-flex items-center gap-1.5">
          <Icon.Megaphone size={13} strokeWidth={2} />
          매물 관련 알림
        </p>
        <ul className="text-xs space-y-1 text-foreground/80">
          <li>· 강남 신축 마사지샵의 광고 기간이 7일 남았습니다. 연장하시려면 결제 페이지로 이동해주세요.</li>
          <li>· 부산 영도 아로마샵에 새로운 찜 알림이 3건 등록되었습니다.</li>
        </ul>
      </div>
    </div>
  );
}
