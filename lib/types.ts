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
