import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ANON_VOTE_DAILY_LIMIT } from "@/lib/constants";

/** POST: 投票（登录用户或匿名IP） */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;
    if (!projectId) {
      return NextResponse.json({ success: false, error: "缺少项目ID" }, { status: 400 });
    }
    // seed/mock 项目(id 非 uuid)不支持投票，避免 uuid 查询/插入报错
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
      return NextResponse.json({ success: false, error: "项目ID无效" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "127.0.0.1";

    // 登录用户投票
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (!authError && user) {
        // 检查是否已投票
        const { data: existing } = await supabaseAdmin
          .from("votes").select("id").eq("user_id", user.id).eq("project_id", projectId).single();

        if (existing) {
          // 取消投票
          const { error } = await supabaseAdmin
            .from("votes").delete().eq("id", existing.id);
          if (error) throw error;
          const { data: proj } = await supabaseAdmin
            .from("projects").select("vote_count").eq("id", projectId).single();
          return NextResponse.json({ success: true, data: { voted: false, voteCount: proj?.vote_count ?? 0 } });
        }

        // 新增投票
        const { error } = await supabaseAdmin
          .from("votes").insert({ user_id: user.id, project_id: projectId });
        if (error) {
          if (error.code === "23505") {
            return NextResponse.json({ success: false, error: "已投票" }, { status: 409 });
          }
          throw error;
        }
        const { data: proj } = await supabaseAdmin
          .from("projects").select("vote_count").eq("id", projectId).single();
        return NextResponse.json({ success: true, data: { voted: true, voteCount: proj?.vote_count ?? 0 } });
      }
    }

    // 匿名IP投票
    // 检查日限额
    const today = new Date().toISOString().split("T")[0];
    const { data: dailyData } = await supabaseAdmin
      .from("ip_votes_daily").select("count").eq("ip_address", ip).eq("vote_date", today).single();

    if (dailyData && dailyData.count >= ANON_VOTE_DAILY_LIMIT) {
      return NextResponse.json({
        success: false,
        error: `今日匿名投票已达上限(${ANON_VOTE_DAILY_LIMIT}次)，登录后不限次数`,
      }, { status: 429 });
    }

    // 插入投票
    const { error } = await supabaseAdmin
      .from("votes").insert({ ip_address: ip, project_id: projectId });
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: false, error: "已投票" }, { status: 409 });
      }
      throw error;
    }

    // 更新日限额
    if (dailyData) {
      await supabaseAdmin
        .from("ip_votes_daily").update({ count: dailyData.count + 1 })
        .eq("ip_address", ip).eq("vote_date", today);
    } else {
      await supabaseAdmin
        .from("ip_votes_daily").insert({ ip_address: ip, vote_date: today, count: 1 });
    }

    const { data: proj } = await supabaseAdmin
      .from("projects").select("vote_count").eq("id", projectId).single();
    return NextResponse.json({ success: true, data: { voted: true, voteCount: proj?.vote_count ?? 0 } });

  } catch (error) {
    console.error("POST /api/votes:", error);
    return NextResponse.json({ success: false, error: "投票失败" }, { status: 500 });
  }
}

/** GET: 检查投票状态 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ success: false, error: "缺少项目ID" }, { status: 400 });
  }
  // seed/mock 项目(id 非 uuid)视为未投票
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    return NextResponse.json({ success: true, data: { voted: false } });
  }

  const authHeader = request.headers.get("authorization");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";

  let voted = false;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) {
      const { data } = await supabaseAdmin
        .from("votes").select("id").eq("user_id", user.id).eq("project_id", projectId).single();
      voted = !!data;
    }
  }

  if (!voted) {
    const { data } = await supabaseAdmin
      .from("votes").select("id").eq("ip_address", ip).eq("project_id", projectId).single();
    voted = !!data;
  }

  return NextResponse.json({ success: true, data: { voted } });
}
