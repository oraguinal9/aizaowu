import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";
const FREE_LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "127.0.0.1";
    const today = new Date().toISOString().split("T")[0];

    // 查询今日已用次数
    const { count } = await supabaseAdmin
      .from("rate_limit_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("endpoint", "write")
      .gte("created_at", today);

    // 登录用户额度翻倍
    let limit = FREE_LIMIT;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) limit = FREE_LIMIT * 2;
    }

    if ((count || 0) >= limit) {
      return NextResponse.json({ success: false, error: `今日免费次数已用完（${limit}次），请明天再试`, remaining: 0 }, { status: 429 });
    }

    // 解析请求
    const { topic, type, length } = await request.json();
    if (!topic?.trim()) {
      return NextResponse.json({ success: false, error: "请输入写作主题" }, { status: 400 });
    }

    const typeMap: Record<string, string> = {
      article: "一篇完整的文章", xiaohongshu: "一篇小红书笔记，包含标题、正文、emoji和标签",
      script: "一个短视频脚本", email: "一封正式邮件", summary: "一个简洁的摘要",
    };
    const typeDesc = typeMap[type] || typeMap.article;
    const wordCount = length === "short" ? "300字左右" : length === "long" ? "1500字左右" : "800字左右";

    const resp = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `你是专业中文写作助手。请生成${typeDesc}，${wordCount}。直接输出内容。` },
          { role: "user", content: topic },
        ],
        temperature: 0.8, max_tokens: 2048,
      }),
    });

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 记录
    await supabaseAdmin.from("rate_limit_log").insert({ ip_address: ip, endpoint: "write" });

    return NextResponse.json({ success: true, data: { content, remaining: limit - (count || 0) - 1 } });
  } catch {
    return NextResponse.json({ success: false, error: "生成失败，请重试" }, { status: 500 });
  }
}
