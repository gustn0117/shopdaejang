"use client";

import { useState, useTransition } from "react";
import { suspendUser, unsuspendUser, deleteUser } from "../actions";

export type UserSummary = {
  id: string;
  email: string;
  name: string;
  phone: string;
  grade: string;
  provider: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  listings_count: number;
};

export function UserActions({ user }: { user: UserSummary }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const banned = !!(user.banned_until && new Date(user.banned_until).getTime() > Date.now());

  function onSuspend() {
    if (!confirm(`${user.email} 계정을 1년 정지하시겠습니까?`)) return;
    start(async () => {
      try {
        await suspendUser(user.id, 365);
      } catch (e) {
        alert(e instanceof Error ? e.message : "정지 처리 실패");
      }
    });
  }
  function onUnsuspend() {
    if (!confirm(`${user.email} 정지를 해제하시겠습니까?`)) return;
    start(async () => {
      try {
        await unsuspendUser(user.id);
      } catch (e) {
        alert(e instanceof Error ? e.message : "정지 해제 실패");
      }
    });
  }
  function onDelete() {
    if (!confirm(`${user.email} 계정을 영구 삭제하시겠습니까?\n복구할 수 없습니다.`)) return;
    start(async () => {
      try {
        await deleteUser(user.id);
        setOpen(false);
      } catch (e) {
        alert(e instanceof Error ? e.message : "삭제 실패");
      }
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="py-1.5 text-xs font-bold border border-border rounded hover:border-foreground"
        >
          상세
        </button>
        {banned ? (
          <button
            type="button"
            onClick={onUnsuspend}
            disabled={pending}
            className="py-1.5 text-xs font-bold border border-free text-free rounded hover:bg-free/5 disabled:opacity-50"
          >
            해제
          </button>
        ) : (
          <button
            type="button"
            onClick={onSuspend}
            disabled={pending}
            className="py-1.5 text-xs font-bold border border-urgent text-urgent rounded hover:bg-urgent/5 disabled:opacity-50"
          >
            정지
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-md border border-border w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black tracking-tight">회원 상세</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground text-sm"
              >
                닫기
              </button>
            </div>

            <dl className="space-y-2 text-sm">
              <Row label="이메일" value={user.email} />
              <Row label="이름" value={user.name} />
              <Row label="연락처" value={user.phone} />
              <Row label="가입 경로" value={user.provider} />
              <Row label="등록 매물" value={`${user.listings_count}건`} />
              <Row
                label="가입일"
                value={new Date(user.created_at).toLocaleString("ko-KR")}
              />
              <Row
                label="최근 접속"
                value={
                  user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString("ko-KR")
                    : "—"
                }
              />
              <Row
                label="계정 상태"
                value={
                  banned
                    ? `정지 (해제 예정: ${new Date(user.banned_until!).toLocaleDateString("ko-KR")})`
                    : "정상"
                }
                highlight={banned}
              />
              <Row label="user_id" value={user.id} mono />
            </dl>

            <div className="flex gap-2 mt-5 pt-4 border-t border-border">
              {banned ? (
                <button
                  type="button"
                  onClick={onUnsuspend}
                  disabled={pending}
                  className="flex-1 py-2.5 text-xs font-bold border border-free text-free rounded disabled:opacity-50"
                >
                  정지 해제
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSuspend}
                  disabled={pending}
                  className="flex-1 py-2.5 text-xs font-bold border border-urgent text-urgent rounded disabled:opacity-50"
                >
                  1년 정지
                </button>
              )}
              <button
                type="button"
                onClick={onDelete}
                disabled={pending}
                className="flex-1 py-2.5 text-xs font-bold bg-urgent text-white rounded hover:bg-urgent/90 disabled:opacity-50"
              >
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <dt className="text-muted shrink-0">{label}</dt>
      <dd
        className={`text-right break-all ${mono ? "font-mono text-[11px]" : ""} ${
          highlight ? "text-urgent font-semibold" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
