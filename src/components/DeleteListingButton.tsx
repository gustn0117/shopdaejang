"use client";

import { useTransition } from "react";
import { deleteListing } from "@/app/mypage/listings/actions";

export function DeleteListingButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  function onClick() {
    if (!confirm("이 매물을 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    start(async () => {
      await deleteListing(id);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-2.5 py-1.5 text-xs font-semibold border border-urgent text-urgent rounded hover:bg-urgent/5 disabled:opacity-50"
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
