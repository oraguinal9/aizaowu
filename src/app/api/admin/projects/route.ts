import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_EMAILS = ["admin@aizaowu.top"];

async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user?.email || !ADMIN_EMAILS.includes(user.email)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: "未授权" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("projects").select("*, category:categories(*)")
    .order("created_at", { ascending: false }).limit(200);

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: "未授权" }, { status: 401 });

  const body = await request.json();
  const { id, status, is_featured } = body;
  if (!id) return NextResponse.json({ success: false, error: "缺少项目ID" }, { status: 400 });

  const updates: Record<string, any> = {};
  if (status) updates.status = status;
  if (is_featured !== undefined) {
    updates.is_featured = is_featured;
    updates.featured_at = is_featured ? new Date().toISOString() : null;
  }

  const { error } = await supabaseAdmin.from("projects").update(updates).eq("id", id);
  if (error) {
    console.error("PATCH /api/admin/projects:", error);
    return NextResponse.json({ success: false, error: "更新失败" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
