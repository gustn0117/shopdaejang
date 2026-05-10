"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

export async function incrementUsedView(id: number) {
  const jar = await cookies();
  const key = `uv_${id}`;
  if (jar.get(key)?.value) return;

  try {
    const admin = createAdminClient();
    await admin.rpc("increment_used_view", { p_id: id });
    jar.set(key, "1", {
      maxAge: 60 * 30,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
  } catch {
    // 조회수 실패는 페이지 렌더를 막지 않음
  }
}
