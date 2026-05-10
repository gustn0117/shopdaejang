"use client";

import { useEffect } from "react";

export function ViewTracker({
  type,
  id,
}: {
  type: "listing" | "used";
  id: number;
}) {
  useEffect(() => {
    fetch(`/api/views/${type}/${id}`, { method: "POST" }).catch(() => {});
  }, [type, id]);
  return null;
}
