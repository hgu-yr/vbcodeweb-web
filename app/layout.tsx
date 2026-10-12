import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibe Coding 导航站',
  description:
    '汇集各类 Vibe Coding 产品与 AI 生成的小程序案例，供开发者借鉴学习。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <Link href="/" className="brand">
              VibeCode<span>Hub</span>
            </Link>
            <nav className="nav-links">
              <Link href="/products">工具</Link>
              <Link href="/mini-programs">小程序</Link>
              <Link href="/articles">文章</Link>
              <Link href="/admin" className="nav-admin">
                后台
              </Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="footer">
          <div className="container">Vibe Coding 导航站 · 仅供学习交流</div>
        </footer>
      </body>
    </html>
  );
}
