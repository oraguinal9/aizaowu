/** AI造物 · 个人 AI 工作室 — 应用常量 */

export const APP_NAME = "AI造物";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aizaow.com";
export const APP_TAGLINE = "一个人 + AI，造出了一家公司的产品线";
export const APP_DESCRIPTION =
  "AI造物 · 个人 AI 工作室。47 个上线作品：AI 智能体、全栈网站、AI 视频、数据分析，每一个都能现场点开体验。从想法到上线的完整交付能力，全在这里看见。";

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

/** ============ 工作室身份 ============ */

/** 联系方式（微信二维码图片放 public/wechat-qr.png 后自动显示） */
export const WECHAT_ID = "AI造物工作室";
export const WECHAT_QR = "/wechat-qr.png";
export const QQ_NUMBER = "503956280";

/** 不在首页展馆展示、仅保留直达详情页的项目（合规考量） */
export const HOMEPAGE_HIDDEN_SLUGS = ["astock-dual-channel"];

/** 四大能力线（首页能力矩阵 + 展馆筛选共用） */
export const ABILITIES = [
  {
    key: "agent",
    icon: "🤖",
    name: "AI 智能体",
    desc: "对话、陪伴、规划、内容生成 —— 从提示词工程到记忆管理、多轮任务编排的完整智能体工程能力。",
  },
  {
    key: "web",
    icon: "🌐",
    name: "全栈网站与应用",
    desc: "从域名、HTTPS、nginx 到前后端与数据库 —— 独立完成可公开访问、可日常运维的完整站点。",
  },
  {
    key: "studio",
    icon: "🎬",
    name: "AI 视频 / 漫剧",
    desc: "角色资产、分镜、图生视频、成片剪辑的全流程生产管线，配套知识库与工具导航。",
  },
  {
    key: "edu",
    icon: "📚",
    name: "内容工程 / 学习站",
    desc: "16 个成体系的 AI 学习站与多个垂直知识库 —— 不只是写代码，还有可复用的方法论资产。",
  },
] as const;
