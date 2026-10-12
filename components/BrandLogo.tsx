import type { ReactNode } from 'react';

// 兜底 logo：拿不到真实图片时，用名称稳定生成一枚「渐变底 + 抽象图形」的图标。
// 全程不使用文字，观感与真实 logo 保持一致。同名会得到同样结果，不同名会得到
// 不同的配色与图形。

const PALETTES: Array<[string, string]> = [
  ['#6366f1', '#8b5cf6'],
  ['#0ea5e9', '#14b8a6'],
  ['#f43f5e', '#f97316'],
  ['#10b981', '#059669'],
  ['#f59e0b', '#f97316'],
  ['#3b82f6', '#6366f1'],
  ['#d946ef', '#a21caf'],
  ['#06b6d4', '#2563eb'],
];

// hashOf 由名称得到稳定整数，保证同一名称始终生成同一枚 logo。
function hashOf(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

// 抽象图形集合：与文字无关，按名称哈希选取。
const MARKS: Array<(c: string) => ReactNode> = [
  (c) => (
    <>
      <circle cx="50" cy="50" r="23" fill="none" stroke={c} strokeWidth="7" />
      <circle cx="50" cy="50" r="8" fill={c} />
    </>
  ),
  (c) => (
    <path d="M50 26L76 72H24z" fill="none" stroke={c} strokeWidth="7" strokeLinejoin="round" />
  ),
  (c) => (
    <>
      <path d="M30 58l24-24" stroke={c} strokeWidth="9" strokeLinecap="round" opacity=".45" />
      <path d="M42 70l24-24" stroke={c} strokeWidth="9" strokeLinecap="round" opacity=".7" />
      <path d="M54 82l24-24" stroke={c} strokeWidth="9" strokeLinecap="round" />
    </>
  ),
  (c) => (
    <>
      <circle cx="38" cy="38" r="9" fill={c} />
      <circle cx="64" cy="38" r="6" fill={c} opacity=".7" />
      <circle cx="38" cy="64" r="6" fill={c} opacity=".7" />
      <circle cx="64" cy="64" r="9" fill={c} />
    </>
  ),
  (c) => (
    <>
      <path d="M24 42q13-12 26 0t26 0" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
      <path d="M24 62q13-12 26 0t26 0" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" opacity=".6" />
    </>
  ),
  (c) => (
    <>
      <path d="M28 64a22 22 0 0 1 44 0" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
      <path d="M40 64a10 10 0 0 1 20 0" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" opacity=".7" />
      <circle cx="50" cy="72" r="4" fill={c} />
    </>
  ),
];

export default function BrandLogo({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const h = hashOf(name || '?');
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const mark = MARKS[(h >> 3) % MARKS.length];
  const gid = `brand-${h.toString(36)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={name}
      style={{
        borderRadius: Math.round(size * 0.24),
        flex: 'none',
        display: 'block',
      }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gid})`} />
      {mark('#ffffff')}
    </svg>
  );
}
