/**
 * Slug 生成工具
 */

/** 生成项目 slug：英文名 + 4位随机后缀 */
export function generateSlug(name: string): string {
  // 尝试提取英文/拼音部分
  const english = name.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
  const base = english
    ? english.toLowerCase().replace(/\s+/g, "-").slice(0, 50)
    : "project";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

/** 简单中文到拼音 slug（只处理常用场景） */
export function nameToSlugCandidate(name: string): string {
  // 如果已有英文部分，直接提取
  const engMatch = name.match(/[a-zA-Z0-9][a-zA-Z0-9\s-]*[a-zA-Z0-9]/);
  if (engMatch) {
    return engMatch[0].toLowerCase().replace(/\s+/g, "-").slice(0, 50);
  }
  // 纯中文：用 project 前缀
  return "project";
}
