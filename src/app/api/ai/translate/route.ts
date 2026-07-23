import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const KEY = process.env.DEEPSEEK_API_KEY || "";
const LIMIT = 5;

const LANGS: Record<string, string> = {
  zh2en: "将以下中文翻译成英文，保持原意和语气，译文地道自然",
  en2zh: "将以下英文翻译成中文，保持原意和语气，译文地道自然",
  zh2ja: "将以下中文翻译成日文，保持原意和语气，译文地道自然",
  zh2ko: "将以下中文翻译成韩文，保持原意和语气，译文地道自然",
};

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "127.0.0.1";
    const today = new Date().toISOString().split("T")[0];

    const { count } = await supabaseAdmin.from("rate_limit_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip).eq("endpoint", "translate").gte("created_at", today);

    let limit = LIMIT;
    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
      if (user) limit = LIMIT * 2;
    }

    if ((count || 0) >= limit) {
      return NextResponse.json({ success: false, error: `今日免费次数已用完（${limit}次）`, remaining: 0 }, { status: 429 });
    }

    const { text, lang } = await request.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: "请输入要翻译的内容" }, { status: 400 });

    const sysPrompt = LANGS[lang] || LANGS.zh2en;

    const resp = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: sysPrompt }, { role: "user", content: text }], temperature: 0.3, max_tokens: 2048 }),
    });

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || "";

    await supabaseAdmin.from("rate_limit_log").insert({ ip_address: ip, endpoint: "translate" });

    return NextResponse.json({ success: true, data: { content, remaining: limit - (count || 0) - 1 } });
  } catch {
    return NextResponse.json({ success: false, error: "翻译失败，请重试" }, { status: 500 });
  }
}
