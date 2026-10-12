import Link from 'next/link';
import { apiGet, buildQuery } from '@/lib/api';
import type { Article, Category, MiniProgram, PageResult, Product } from '@/lib/types';
import ImgLogo from '@/components/ImgLogo';
import { miniLogo } from '@/lib/logo';

export const dynamic = 'force-dynamic';

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await apiGet<T>(path);
  } catch {
    return fallback;
  }
}

function emptyPage<T>(size: number): PageResult<T> {
  return { list: [], total: 0, page: 1, size };
}

export default async function HomePage() {
  const [productPage, programPage, articlePage, categoryPage] = await Promise.all([
    safeGet<PageResult<Product>>(`/products${buildQuery({ featured: 1, size: 6 })}`, emptyPage<Product>(6)),
    safeGet<PageResult<MiniProgram>>(`/mini-programs${buildQuery({ featured: 1, size: 6 })}`, emptyPage<MiniProgram>(6)),
    safeGet<PageResult<Article>>(`/articles${buildQuery({ status: 1, size: 5 })}`, emptyPage<Article>(5)),
    safeGet<PageResult<Category>>(`/categories${buildQuery({ size: 30 })}`, emptyPage<Category>(30)),
  ]);

  const products = productPage.list;
  const programs = programPage.list;
  const articles = articlePage.list;

  return (
    <>
      <section className="hero">
        <h1>发现最好的 Vibe Coding</h1>
        <p className="sub">
          汇集 AI 编程工具与用 AI 生成的小程序案例，供开发者借鉴学习。
        </p>
        <div className="tags">
          {categoryPage.list.map((c) => (
            <span className="tag" key={c.ID}>
              {c.name}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>精选工具</h2>
          <Link href="/products">查看全部 →</Link>
        </div>
        <div className="grid">
          {products.map((p) => (
            <Link href={`/products/${p.slug}`} className="card" key={p.ID}>
              <div className="row">
                <ImgLogo src={`/logos/${p.slug}.png`} name={p.name} size={36} />
                <h3>{p.name}</h3>
              </div>
              <p>{p.tagline}</p>
              <div className="tags">
                {p.pricing && <span className="tag">{p.pricing}</span>}
              </div>
            </Link>
          ))}
          {products.length === 0 && <div className="center">暂无数据</div>}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>AI 生成的小程序案例</h2>
          <Link href="/mini-programs">查看全部 →</Link>
        </div>
        <div className="grid">
          {programs.map((m) => (
            <Link href={`/mini-programs/${m.slug}`} className="card" key={m.ID}>
              <div className="brand-cover">
                <ImgLogo src={miniLogo(m.slug)} name={m.name} size={64} />
              </div>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <div className="tags">
                {m.builder_tool && (
                  <span className="tag">由 {m.builder_tool} 生成</span>
                )}
              </div>
            </Link>
          ))}
          {programs.length === 0 && <div className="center">暂无数据</div>}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>最新文章</h2>
          <Link href="/articles">查看全部 →</Link>
        </div>
        <div className="grid">
          {articles.map((a) => (
            <Link href={`/articles/${a.slug}`} className="card" key={a.ID}>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
            </Link>
          ))}
          {articles.length === 0 && <div className="center">暂无数据</div>}
        </div>
      </section>
    </>
  );
}
