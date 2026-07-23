import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeInput } from "@/lib/utils";

/** GET: 获取项目评论 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ success: false, error: "缺少项目ID" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("GET /api/comments:", error);
    return NextResponse.json({ success: false, error: "获取评论失败" }, { status: 500 });
  }

  // 构建嵌套结构（user_email 由前端通过 getEmail fallback 显示）
  const topLevel = data.filter((c: any) => !c.parent_id);
  const replies = data.filter((c: any) => c.parent_id);
  const nested = topLevel.map((c: any) => ({
    ...c,
    replies: replies.filter((r: any) => r.parent_id === c.id),
  }));

  return NextResponse.json({ success: true, data: nested });
}

/** POST: 添加评论（需登录） */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "登录已过期" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, body: commentBody, parentId } = body;
    if (!projectId || !commentBody) {
      return NextResponse.json({ success: false, error: "缺少参数" }, { status: 400 });
    }

    // 验证 parent 是顶层评论（只允许2层嵌套）
    if (parentId) {
      const { data: parent } = await supabaseAdmin
        .from("comments").select("parent_id").eq("id", parentId).single();
      if (parent?.parent_id) {
        return NextResponse.json({ success: false, error: "不支持三层嵌套回复" }, { status: 400 });
      }
    }

    const { error } = await supabaseAdmin.from("comments").insert({
      project_id: projectId,
      user_id: user.id,
      parent_id: parentId || null,
      body: sanitizeInput(commentBody, 2000),
    });

    if (error) {
      console.error("POST /api/comments:", error);
      return NextResponse.json({ success: false, error: "评论失败" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/comments:", error);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
