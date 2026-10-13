import fs from 'fs';
import path from 'path';

import { mediaUrl } from './api';

// localLogo 返回 public 下真实存在的图片路径；不存在则返回 undefined，
// 让组件走兜底且不产生 404 请求。
export function localLogo(rel: string): string | undefined {
  const clean = rel.replace(/^\//, '');
  const full = path.join(process.cwd(), 'public', clean);
  try {
    return fs.existsSync(full) ? `/${clean}` : undefined;
  } catch {
    return undefined;
  }
}

// miniLogo 依次尝试 png / svg，返回第一个真实存在的资源路径；
// 都不存在时返回 undefined，由组件回退到生成的兜底 logo。
export function miniLogo(slug: string): string | undefined {
  return localLogo(`logos/mini/${slug}.png`) ?? localLogo(`logos/mini/${slug}.svg`);
}

// productLogo 优先用本地图标，其次用后台上传的图片地址。
export function productLogo(slug: string, dbLogo?: string | null): string | undefined {
  return localLogo(`logos/${slug}.png`) ?? localLogo(`logos/${slug}.svg`) ?? mediaUrl(dbLogo);
}

// miniArt 小程序主图：本地图标优先，其次上传的封面/小程序码。
export function miniArt(
  slug: string,
  cover?: string | null,
  code?: string | null,
): string | undefined {
  return miniLogo(slug) ?? mediaUrl(cover) ?? mediaUrl(code);
}
