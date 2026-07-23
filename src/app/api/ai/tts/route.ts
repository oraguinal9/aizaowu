import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const TTS_URL = "http://114.55.148.70/tts/"; // Nginx → 127.0.0.1:5001
const LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "127.0.0.1";
    const today = new Date().toISOString().split("T")[0];

    const { count } = await supabaseAdmin.from("rate_limit_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip).eq("endpoint", "tts").gte("created_at", today);

    let limit = LIMIT;
    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) { const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", "")); if (user) limit = LIMIT * 2; }
    if ((count || 0) >= limit) return NextResponse.json({ success: false, error: `今日免费次数已用完`, remaining: 0 }, { status: 429 });

    const { text, voice } = await request.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: "请输入文本" }, { status: 400 });

    const url = `${TTS_URL}?text=${encodeURIComponent(text.slice(0, 200))}&style=${voice || "tianmei"}`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });

    if (!resp.ok) return NextResponse.json({ success: false, error: "语音合成失败" }, { status: 500 });

    const audioBuffer = await resp.arrayBuffer();
    const base64 = Buffer.from(audioBuffer).toString("base64");

    await supabaseAdmin.from("rate_limit_log").insert({ ip_address: ip, endpoint: "tts" });

    return NextResponse.json({ success: true, data: { audio: `data:audio/mp3;base64,${base64}`, remaining: limit - (count || 0) - 1 } });
  } catch { return NextResponse.json({ success: false, error: "合成失败" }, { status: 500 }); }
}
