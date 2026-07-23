/**
 * 通用工具函数
 */

/** 生成随机 token */
export function generateToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/** 截取文本摘要（中文友好） */
export function summarizeText(text: string, maxChars: number = 200): string {
  if (text.length <= maxChars) return text;
  const truncated = text.slice(0, maxChars);
  const lastPeriod = Math.max(
    truncated.lastIndexOf("。"), truncated.lastIndexOf("！"),
    truncated.lastIndexOf("？"), truncated.lastIndexOf("\n")
  );
  if (lastPeriod > maxChars * 0.6) return truncated.slice(0, lastPeriod + 1) + "…";
  return truncated + "…";
}

/** 清理用户输入 */
export function sanitizeInput(input: string, maxLength: number = 5000): string {
  return input.trim().slice(0, maxLength)
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");
}

/** 格式化日期（中文） */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

/** 格式化相对时间 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return formatDate(date);
}
