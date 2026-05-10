"use client";

import { useTransition } from "react";
import { approveListing, rejectListing } from "../actions";
import { useToast } from "@/components/Toast";

export function RowActions({ id }: { id: number }) {
  const [pending, start] = useTransition();
  const toast = useToast();
  return (
    <div className="grid grid-cols-3 gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => {
          try {
            await approveListing(id);
            toast.success(`#${id} 승인 완료`);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "처리 실패");
          }
        })}
        className="py-1.5 text-xs font-bold bg-foreground text-white rounded disabled:opacity-50"
      >
        승인
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => {
          try {
            await rejectListing(id);
            toast.success(`#${id} 반려 처리`);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "처리 실패");
          }
        })}
        className="py-1.5 text-xs font-bold border border-urgent text-urgent rounded disabled:opacity-50"
      >
        반려
      </button>
      <a href={`/listings/${id}`} target="_blank" rel="noreferrer" className="py-1.5 text-xs font-bold border border-border rounded text-center">
        상세
      </a>
    </div>
  );
}
