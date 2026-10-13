export interface Category {
  ID: number;
  name: string;
  slug: string;
  scope: number;
  sort: number;
}

export interface Product {
  ID: number;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  description: string;
  website_url: string;
  category_id: number;
  pricing: string;
  platforms: string;
  status: number;
  featured: number;
  click_count: number;
}

export interface MiniProgram {
  ID: number;
  name: string;
  slug: string;
  app_id: string;
  subject: string;
  cover: string;
  mini_code_img: string;
  description: string;
  builder_tool: string;
  category_id: number;
  guide_url: string;
  status: number;
  featured: number;
  click_count: number;
}

export interface Article {
  ID: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover: string;
  category_id: number;
  status: number;
  view_count: number;
  published_at: string | null;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface LoginResult {
  token: string;
  user: {
    id: number;
    username: string;
    nickname: string;
    role: string;
  };
}

export interface Submission {
  ID: number;
  CreatedAt: string;
  kind: number; // 1 工具 2 小程序
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  pricing: string;
  platforms: string;
  app_id: string;
  subject: string;
  builder_tool: string;
  guide_url: string;
  category_id: number;
  logo_url: string;
  cover_url: string;
  mini_code_url: string;
  contact: string;
  status: number; // 0 待审核 1 通过 2 拒绝
  review_note: string;
  published_id: number;
  ip: string;
  reviewed_at: string | null;
}
