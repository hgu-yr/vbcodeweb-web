import fs from 'fs';
import path from 'path';

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
