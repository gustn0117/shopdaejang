import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";

export const metadata = { title: "마이페이지" };

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "회원";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold text-muted tracking-[0.18em] uppercase mb-2">
          My Page
        </p>
        <h1 className="h-display text-2xl lg:text-3xl">
          안녕하세요, <span className="text-muted-strong">{name}</span>님
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "내 매물", value: "—", href: "/mypage/listings" },
          { label: "노출중", value: "—", href: "/mypage/listings?status=approved" },
          { label: "승인대기", value: "—", href: "/mypage/listings?status=pending" },
          { label: "찜한매물", value: "—", href: "/mypage/favorites" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="surface-card p-4 lg:p-5 hover:border-foreground transition-colors">
            <p className="text-[11px] text-muted mb-1.5">{s.label}</p>
            <p className="text-xl lg:text-2xl font-black tabular">{s.value}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-muted">
              자세히
              <Icon.ChevronRight size={11} />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm tracking-tight">최근 매물</h2>
            <Link href="/mypage/listings" className="inline-flex items-center gap-0.5 text-[12px] text-muted hover:text-foreground">
              전체보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          <p className="text-sm text-muted">
            등록한 매물이 없습니다. 우측 상단에서 새 매물을 등록해보세요.
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm tracking-tight">최근 결제내역</h2>
            <Link href="/mypage/payments" className="inline-flex items-center gap-0.5 text-[12px] text-muted hover:text-foreground">
              전체보기
              <Icon.ChevronRight size={11} />
            </Link>
          </div>
          <p className="text-sm text-muted">
            결제 내역이 없습니다.
          </p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-md p-5">
        <p className="text-sm font-bold mb-2 inline-flex items-center gap-2">
          <Icon.Megaphone size={13} strokeWidth={2} />
          알림
        </p>
        <p className="text-[12px] text-muted leading-relaxed">
          광고 만료 7일 전, 새로운 찜 등록, 매물 승인 결과 등 주요 알림을 이곳에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
