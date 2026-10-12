const COLORS: Record<string, string> = {
  Cursor: '#1f2937',
  Windsurf: '#06b6d4',
  Trae: '#ff5c5c',
  v0: '#0f172a',
  'Bolt.new': '#1389fd',
  Lovable: '#f43f5e',
  'Replit Agent': '#f26207',
  'Claude Code': '#d97757',
  'GitHub Copilot': '#24292f',
  Qodo: '#7c3aed',
  Onlook: '#0ea5e9',
  Devin: '#16a34a',
  Tabnine: '#8b5cf6',
  Supermaven: '#f59e0b',
  Continue: '#ef4444',
  Cline: '#3b82f6',
  'Roo Code': '#14b8a6',
  'Augment Code': '#6366f1',
  'Firebase Studio': '#eab308',
};

// colorFor 为名称挑选品牌色，未预置的按名称哈希生成稳定颜色。
function colorFor(name: string): string {
  if (COLORS[name]) return COLORS[name];
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return `hsl(${h}, 62%, 45%)`;
}

// BrandLogo 用本地渲染的品牌徽标替代外链图片，保证离线也能显示。
export default function BrandLogo({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const label = (name || '?').trim().slice(0, 1).toUpperCase();
  return (
    <span
      className="brand-logo"
      style={{
        width: size,
        height: size,
        background: colorFor(name || ''),
        fontSize: Math.round(size * 0.46),
        borderRadius: Math.round(size * 0.24),
      }}
    >
      {label}
    </span>
  );
}
