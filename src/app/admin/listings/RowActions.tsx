"use client";

import { useTransition } from "react";
import { approveListing, rejectListing } from "../actions";
import { useToast } from "@/components/Toast";

export function RowActions({
  id,
  status,
}: {
  id: number;
  status?: "pending" | "approved" | "rejected" | "expired" | "sold";
}) {
  const [pending, start] = useTransition();
  const toast = useToast();

  const showApprove = status !== "approved";
  const showReject = status !== "rejected";

  return (
    <div className="flex gap-1">
      {showApprove && (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              try {
                await approveListing(id);
                toast.success(`#${id} 승인 완료`);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "처리 실패");
              }
            })
          }
          className="flex-1 py-1.5 text-xs font-bold bg-foreground text-white rounded disabled:opacity-50"
        >
          승인
        </button>
      )}
      {showReject && (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              try {
                await rejectListing(id);
                toast.success(`#${id} 반려 처리`);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "처리 실패");
              }
            })
          }
          className="flex-1 py-1.5 text-xs font-bold border border-urgent text-urgent rounded disabled:opacity-50"
        >
          반려
        </button>
      )}
      <a
        href={`/listings/${id}`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-1.5 text-xs font-bold border border-border rounded text-center"
      >
        상세
      </a>
    </div>
  );
}
