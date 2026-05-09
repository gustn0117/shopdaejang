"use client";

import { useTransition } from "react";
import { approveListing, rejectListing } from "../actions";

export function RowActions({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <div className="grid grid-cols-3 gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => approveListing(id))}
        className="py-1.5 text-xs font-bold bg-foreground text-white rounded disabled:opacity-50"
      >
        승인
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => rejectListing(id))}
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
