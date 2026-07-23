import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const IMG_URL = "http://114.55.148.70/image/";
const LIMIT = 3;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "127.0.0.1";
    const today = new Date().toISOString().split("T")[0];

    const { count } = await supabaseAdmin.from("rate_limit_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip).eq("endpoint", "image").gte("created_at", today);

    let limit = LIMIT;
    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
      if (user) limit = LIMIT * 2;
    }
    if ((count || 0) >= limit) {
      return NextResponse.json({ success: false, error: `今日免费次数已用完（${limit}次）`, remaining: 0 }, { status: 429 });
    }

    const { prompt, style } = await request.json();
    if (!prompt?.trim()) return NextResponse.json({ success: false, error: "请输入画面描述" }, { status: 400 });

    const styles: Record<string, string> = { default: "", realistic: "photorealistic, 8k, high detail, ", anime: "anime style, manga, studio ghibli, ", cyberpunk: "cyberpunk, neon lights, sci-fi, futuristic city, " };
    const fullPrompt = (styles[style] || "") + prompt.trim().slice(0, 500);

    const resp = await fetch(IMG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: fullPrompt, style: style || "default" }),
      signal: AbortSignal.timeout(90000),
    });

    const data = await resp.json();
    if (data.error) return NextResponse.json({ success: false, error: data.error }, { status: 500 });

    const urls = data.urls || [];
    if (!urls.length) return NextResponse.json({ success: false, error: "未返回图片" }, { status: 500 });

    await supabaseAdmin.from("rate_limit_log").insert({ ip_address: ip, endpoint: "image" });

    return NextResponse.json({ success: true, data: { urls, remaining: limit - (count || 0) - 1 } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "生成失败" }, { status: 500 });
  }
}
