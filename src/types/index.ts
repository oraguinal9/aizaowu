/** 项目状态 */
export type ProjectStatus = "published" | "hidden";

/** 分类 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
}

/** 项目 */
export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category_id: string | null;
  tags: string[];
  screenshots: string[];
  thumbnail_url: string | null;
  status: ProjectStatus;
  vote_count: number;
  comment_count: number;
  view_count: number;
  submitter_id: string | null;
  is_featured: boolean;
  created_at: string;
  published_at: string;
  updated_at: string;
  // JOIN 字段
  category?: Category | null;
}

/** 投票 */
export interface Vote {
  id: string;
  user_id: string | null;
  ip_address: string | null;
  project_id: string;
  created_at: string;
}

/** 评论 */
export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  // JOIN 字段
  replies?: Comment[];
  user_email?: string;
}

/** API 统一响应 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** 投票结果 */
export interface VoteResult {
  canVote: boolean;
  voted: boolean;
  voteCount: number;
  reason?: string;
}
