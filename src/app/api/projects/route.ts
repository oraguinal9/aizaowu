import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeInput } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, tagline, url, category_id, description, tags, slug, screenshots, thumbnail_url } = body;

    // 验证
    if (!name || !tagline || !url) {
      return NextResponse.json({ success: false, error: "请填写必填字段" }, { status: 400 });
    }

    // 获取当前用户（通过 Supabase Auth）
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "登录已过期" }, { status: 401 });
    }

    const { error } = await supabaseAdmin.from("projects").insert({
      slug,
      name: sanitizeInput(name, 100),
      tagline: sanitizeInput(tagline, 120),
      url: sanitizeInput(url, 500),
      category_id: category_id || null,
      description: sanitizeInput(description || "", 10000),
      tags: tags || [],
      screenshots: screenshots || [],
      thumbnail_url: thumbnail_url || null,
      submitter_id: user.id,
      status: "published",
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, error: "项目链接已存在" }, { status: 409 });
      }
      console.error("POST /api/projects:", error);
      return NextResponse.json({ success: false, error: "提交失败" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { slug } });
  } catch (error) {
    console.error("POST /api/projects:", error);
    return NextResponse.json({ success: false, error: "服务器错误" }, { status: 500 });
  }
}
