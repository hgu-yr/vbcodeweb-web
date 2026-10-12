const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8899';

interface ApiResp<T> {
  code: number;
  message: string;
  data: T;
}

async function unwrap<T>(res: Response): Promise<T> {
  let json: ApiResp<T>;
  try {
    json = (await res.json()) as ApiResp<T>;
  } catch {
    throw new Error(`请求失败(${res.status})`);
  }
  if (json.code !== 0) throw new Error(json.message || '请求失败');
  return json.data;
}

// apiGet 服务端/客户端通用 GET
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, { cache: 'no-store' });
  return unwrap<T>(res);
}

// apiSend 写操作，需要携带登录 token
export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return unwrap<T>(res);
}

// buildQuery 拼接查询参数
export function buildQuery(
  params: Record<string, string | number | undefined | null>,
): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}
