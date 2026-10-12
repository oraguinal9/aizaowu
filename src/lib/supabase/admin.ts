/**
 * Supabase 服务端客户端（Server Components / API Routes 用，绕过 RLS）
 *
 * ⚠️ 后端不可达时必须快速失败：默认 fetch 会等 DNS/TCP 超时（实测 15s），
 * 把页面渲染一起拖死。这里统一加 1.5s 超时，超时即走 mock 兜底。
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** 带 1.5s 超时的 fetch */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * 是否启用 Supabase 后端。
 *
 * 本站后端域名 `qscxiigcqhmzwmkwpczg.supabase.co` 已失效（权威 NXDOMAIN），
 * 每次数据读取都会等 DNS / 连接超时（实测每页拖慢约 15 秒），并让动态路由
 * 无法预渲染。站已转为纯个人作品展示，故默认直接用内置数据。
 *
 * 恢复后端：在 .env.local 删除 USE_MOCK_ONLY，或设为 0，然后重新构建。
 */
export const BACKEND_ENABLED = process.env.USE_MOCK_ONLY !== "1";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: fetchWithTimeout,
  },
});

export function getSupabaseAdmin() {
  return supabaseAdmin;
}
