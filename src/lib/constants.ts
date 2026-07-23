/** AI造物 — 应用常量 */

export const APP_NAME = "AI造物";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aizaow.com";
export const APP_TAGLINE = "发现 AI 创造的酷项目";
export const APP_DESCRIPTION =
  "AI造物是一个发现和展示AI创造项目的平台。素人开发者用AI做出的网站、工具、游戏、应用，都在这里。";

/** 匿名投票每日上限 */
export const ANON_VOTE_DAILY_LIMIT = 3;

/** 分页 */
export const PROJECTS_PER_PAGE = 24;
export const RANKINGS_PER_PAGE = 50;

/** 分类预设 */
export const DEFAULT_CATEGORIES = [
  { slug: "productivity", name: "效率工具", icon: "⚡", description: "提升工作效率的AI工具和自动化方案" },
  { slug: "creative", name: "创意设计", icon: "🎨", description: "AI驱动的设计、图像、视频创作项目" },
  { slug: "games", name: "游戏", icon: "🎮", description: "AI辅助开发的游戏和互动娱乐" },
  { slug: "education", name: "教育学习", icon: "📚", description: "AI赋能的学习工具和教育应用" },
  { slug: "content", name: "内容创作", icon: "✍️", description: "AI写作、翻译、内容生成类项目" },
  { slug: "lifestyle", name: "生活娱乐", icon: "🌟", description: "AI改变日常生活和娱乐方式的应用" },
  { slug: "devtools", name: "开发者工具", icon: "🛠️", description: "面向开发者的AI辅助编程和工具" },
  { slug: "finance", name: "金融工具", icon: "💰", description: "AI在金融、投资、数据分析中的应用" },
  { slug: "other", name: "其他", icon: "📦", description: "更多有趣的AI创造项目" },
] as const;
