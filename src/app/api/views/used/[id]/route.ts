import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const usedId = Number(id);
  if (!Number.isInteger(usedId) || usedId <= 0) {
    return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
  }

  const cookieKey = `uv_${usedId}`;
  if (request.cookies.get(cookieKey)?.value) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  try {
    const admin = createAdminClient();
    await admin.rpc("increment_used_view", { p_id: usedId });
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ok: true, throttled: false });
  res.cookies.set(cookieKey, "1", {
    maxAge: 60 * 30,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
  return res;
}
