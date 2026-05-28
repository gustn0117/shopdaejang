import { Icon } from "@/components/Icon";
import { createAdminClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/format";
import { UserActions, type UserSummary } from "./UserActions";

export const metadata = { title: "회원 관리", robots: "noindex" };
export const dynamic = "force-dynamic";

async function fetchUsers(): Promise<{ users: UserSummary[]; total: number }> {
  const admin = createAdminClient();
  const [{ data: authData }, { data: profiles, count }, { data: listings }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 100 }),
      admin
        .from("profiles")
        .select("id, name, phone, member_grade, created_at", { count: "exact" }),
      admin.from("listings").select("user_id"),
    ]);

  const profileMap = new Map(
    ((profiles ?? []) as Array<{
      id: string;
      name: string | null;
      phone: string | null;
      member_grade: string;
      created_at: string;
    }>).map((p) => [p.id, p])
  );

  const listingsByUser = new Map<string, number>();
  for (const l of (listings ?? []) as Array<{ user_id: string | null }>) {
    if (!l.user_id) continue;
    listingsByUser.set(l.user_id, (listingsByUser.get(l.user_id) ?? 0) + 1);
  }

  const users: UserSummary[] = (authData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    name:
      profileMap.get(u.id)?.name ??
      (u.user_metadata?.name as string | undefined) ??
      "—",
    phone:
      profileMap.get(u.id)?.phone ??
      (u.user_metadata?.phone as string | undefined) ??
      "—",
    grade: profileMap.get(u.id)?.member_grade ?? "normal",
    provider: (u.app_metadata?.provider as string | undefined) ?? "email",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    banned_until: (u as { banned_until?: string | null }).banned_until ?? null,
    listings_count: listingsByUser.get(u.id) ?? 0,
  }));

  return { users, total: count ?? users.length };
}

export default async function AdminUsersPage() {
  const { users, total } = await fetchUsers();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl font-black tracking-tight">회원 관리</h1>
        <span className="text-xs text-muted tabular">총 {total.toLocaleString()}명</span>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-md border border-border p-12 text-center">
          <Icon.Users size={28} className="mx-auto mb-3 text-muted" />
          <p className="text-sm font-semibold">아직 가입한 회원이 없습니다.</p>
          <p className="text-xs text-muted mt-1">회원이 가입하면 이곳에서 관리할 수 있습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[200px_1fr_100px_100px_100px_120px] gap-2 px-3 py-2 bg-zinc-50 border-b border-border text-[11px] font-bold text-muted">
            <div>이메일</div>
            <div>이름 / 연락처</div>
            <div>경로</div>
            <div>가입일</div>
            <div>최근 접속</div>
            <div className="text-center">처리</div>
          </div>
          <ul className="divide-y divide-border">
            {users.map((u) => {
              const banned =
                !!(u.banned_until && new Date(u.banned_until).getTime() > Date.now());
              return (
                <li
                  key={u.id}
                  className="grid grid-cols-1 md:grid-cols-[200px_1fr_100px_100px_100px_120px] gap-2 px-3 py-3 text-sm items-center"
                >
                  <div className="text-xs font-medium truncate flex items-center gap-1.5 min-w-0">
                    {banned && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold border border-urgent text-urgent rounded shrink-0">
                        정지
                      </span>
                    )}
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-[11px] text-muted">{u.phone}</p>
                  </div>
                  <div className="text-xs text-muted hidden md:block">{u.provider}</div>
                  <div className="text-xs text-muted hidden md:block">
                    {formatRelativeDate(u.created_at)}
                  </div>
                  <div className="text-xs text-muted hidden md:block">
                    {u.last_sign_in_at ? formatRelativeDate(u.last_sign_in_at) : "—"}
                  </div>
                  <UserActions user={u} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
