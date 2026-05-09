import { Icon } from "@/components/Icon";

export const metadata = { title: "회원 관리", robots: "noindex" };

const USERS = [
  { id: "U-12847", name: "홍길동", email: "user1@example.com", joined: "네이버", date: "2026-05-08", listings: 3, status: "정상" },
  { id: "U-12846", name: "김철수", email: "user2@example.com", joined: "카카오", date: "2026-05-08", listings: 1, status: "정상" },
  { id: "U-12845", name: "이영희", email: "user3@example.com", joined: "구글", date: "2026-05-07", listings: 0, status: "정상" },
  { id: "U-12844", name: "박민수", email: "user4@example.com", joined: "이메일", date: "2026-05-07", listings: 5, status: "정지" },
  { id: "U-12843", name: "최지원", email: "user5@example.com", joined: "네이버", date: "2026-05-06", listings: 2, status: "정상" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">회원 관리</h1>
        <span className="text-xs text-muted">총 12,847명</span>
      </div>

      <div className="bg-white rounded-md border border-border p-3 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-50">
          <Icon.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="이름·이메일·ID 검색" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded focus:outline-none focus:border-foreground" />
        </div>
        <select className="px-3 py-2 text-sm border border-border rounded">
          <option>전체 등급</option>
          <option>일반회원</option>
          <option>사업자회원</option>
        </select>
        <select className="px-3 py-2 text-sm border border-border rounded">
          <option>전체 상태</option>
          <option>정상</option>
          <option>정지</option>
          <option>탈퇴</option>
        </select>
      </div>

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[100px_1fr_140px_100px_80px_80px_120px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
          <div>회원 ID</div>
          <div>이름 / 이메일</div>
          <div>가입경로</div>
          <div>가입일</div>
          <div className="text-center">매물</div>
          <div className="text-center">상태</div>
          <div className="text-center">처리</div>
        </div>
        <ul className="divide-y divide-border">
          {USERS.map((u) => (
            <li key={u.id} className="grid grid-cols-1 md:grid-cols-[100px_1fr_140px_100px_80px_80px_120px] gap-2 px-3 py-3 text-sm items-center">
              <div className="text-xs font-mono">{u.id}</div>
              <div>
                <p className="text-sm font-bold">{u.name}</p>
                <p className="text-[11px] text-muted">{u.email}</p>
              </div>
              <div className="text-xs text-muted hidden md:block">{u.joined}</div>
              <div className="text-xs text-muted hidden md:block">{u.date}</div>
              <div className="text-xs text-center hidden md:block">{u.listings}건</div>
              <div className="text-center">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white ${
                  u.status === "정상" ? "border-free text-free" : "border-urgent text-urgent"
                }`}>
                  {u.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button type="button" className="py-1.5 text-xs font-bold border border-border rounded">상세</button>
                <button type="button" className={`py-1.5 text-xs font-bold border rounded ${
                  u.status === "정상" ? "border-urgent text-urgent" : "border-foreground text-foreground"
                }`}>
                  {u.status === "정상" ? "정지" : "복구"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
