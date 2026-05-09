import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "관리자 대시보드", robots: "noindex" };

const STATS = [
  { label: "총 회원수", value: "12,847", change: "+47" },
  { label: "오늘 신규 가입", value: "23", change: "+5" },
  { label: "전체 매물", value: "8,932", change: "+89" },
  { label: "오늘 등록", value: "47", change: "-2" },
  { label: "승인 대기", value: "12", change: "+12" },
  { label: "오늘 결제", value: "2,470,000원", change: "+890,000" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg lg:text-xl font-black tracking-tight">관리자 대시보드</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-md border border-border p-3 lg:p-4">
            <p className="text-[11px] text-muted">{s.label}</p>
            <p className="text-lg lg:text-2xl font-black mt-1">{s.value}</p>
            <p className={`text-[11px] mt-1 ${s.change.startsWith("+") ? "text-free" : "text-urgent"}`}>
              {s.change} (어제 대비)
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-md border border-border p-4">
          <h2 className="font-bold text-sm mb-3">긴급 처리 항목</h2>
          <div className="space-y-2">
            <Link href="/admin/listings" className="flex items-center justify-between p-3 border border-border rounded hover:bg-zinc-50">
              <div>
                <p className="text-sm font-bold">매물 승인 대기</p>
                <p className="text-xs text-muted">12건이 검토를 기다리고 있습니다</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-foreground text-white text-xs font-bold rounded">
                처리하기
                <Icon.ChevronRight size={11} />
              </span>
            </Link>
            <Link href="/admin/reports" className="flex items-center justify-between p-3 border border-border rounded hover:bg-zinc-50">
              <div>
                <p className="text-sm font-bold">신고 미처리</p>
                <p className="text-xs text-muted">3건이 검토를 기다리고 있습니다</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-urgent text-white text-xs font-bold rounded">
                확인
                <Icon.ChevronRight size={11} />
              </span>
            </Link>
            <Link href="/admin/payments" className="flex items-center justify-between p-3 border border-border rounded hover:bg-zinc-50">
              <div>
                <p className="text-sm font-bold">환불 요청</p>
                <p className="text-xs text-muted">2건이 처리 대기중입니다</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-premium text-white text-xs font-bold rounded">
                처리
                <Icon.ChevronRight size={11} />
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-md border border-border p-4">
          <h2 className="font-bold text-sm mb-3">최근 활동</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 pb-2 border-b border-border">
              <span className="px-1.5 py-0.5 border border-foreground text-foreground text-[10px] font-bold rounded shrink-0">매물</span>
              <div className="flex-1">
                <p className="text-xs">새 매물 등록: 강남 신축 마사지샵 권리인하 급매</p>
                <p className="text-[10px] text-muted">방금 전 · 일반회원</p>
              </div>
            </li>
            <li className="flex items-start gap-2 pb-2 border-b border-border">
              <span className="px-1.5 py-0.5 border border-free text-free text-[10px] font-bold rounded shrink-0">결제</span>
              <div className="flex-1">
                <p className="text-xs">긴급매물 1개월 결제 (90,000원)</p>
                <p className="text-[10px] text-muted">5분 전 · user@example.com</p>
              </div>
            </li>
            <li className="flex items-start gap-2 pb-2 border-b border-border">
              <span className="px-1.5 py-0.5 border border-foreground text-foreground text-[10px] font-bold rounded shrink-0">승인</span>
              <div className="flex-1">
                <p className="text-xs">매물 승인 완료: 수원 우량 스웨디시 매장</p>
                <p className="text-[10px] text-muted">12분 전 · admin</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 border border-urgent text-urgent text-[10px] font-bold rounded shrink-0">신고</span>
              <div className="flex-1">
                <p className="text-xs">신고 접수: 사기 의심 매물 (#58921)</p>
                <p className="text-[10px] text-muted">1시간 전 · 익명</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
