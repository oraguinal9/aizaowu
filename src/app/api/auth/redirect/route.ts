import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/auth/redirect?to=lingxi&from=/projects/some-slug
// 生成带 token 的跳转链接，子项目收到 token 后自动登录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("to"); // lingxi / comic / etc
  const referer = request.headers.get("referer") || "/tools";

  // 映射目标地址
  const targets: Record<string, string> = {
    lingxi: "https://lingxi.zbjh.top",
    comic: "https://comic.zbjh.top",
    xiaoling: "https://xiaoling.zbjh.top",
    yuyan: "https://yuyan.zbjh.top",
    shijie: "https://shijie.zbjh.top",
    aiwriter: "https://zbjh.top",
    ainovel: "https://ai.zbjh.top",
  };

  const targetUrl = target && targets[target] ? targets[target] : null;
  if (!targetUrl) {
    return NextResponse.redirect(new URL(referer, request.url));
  }

  // 获取当前用户（如果有登录）
  const authHeader = request.headers.get("authorization");
  let accessToken = "";

  if (authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.replace("Bearer ", "");
  } else {
    // 尝试从 cookie 获取
    const cookie = request.cookies.get("sb-qscxiigcqhmzwmkwpczg-auth-token");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie.value);
        accessToken = parsed.access_token || "";
      } catch {}
    }
  }

  // 带 token 跳转到子项目
  if (accessToken) {
    const redirectUrl = new URL("/api/auth/callback", targetUrl);
    redirectUrl.searchParams.set("token", accessToken);
    redirectUrl.searchParams.set("redirect_to", targetUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // 未登录直接跳转
  return NextResponse.redirect(targetUrl);
}
