import Link from 'next/link';
import { apiGet, buildQuery } from '@/lib/api';
import type { Article, PageResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

const SIZE = 10;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string; keyword?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const keyword = searchParams.keyword || '';

  let data: PageResult<Article> = { list: [], total: 0, page, size: SIZE };
  try {
    data = await apiGet<PageResult<Article>>(
      `/articles${buildQuery({ page, size: SIZE, keyword, status: 1 })}`,
    );
  } catch {
    // 后端不可用时展示空列表
  }

  const totalPages = Math.max(1, Math.ceil(data.total / SIZE));
  const link = (p: number) => `/articles${buildQuery({ page: p, keyword })}`;

  return (
    <>
      <h1>文章与教程</h1>
      <p className="sub">Vibe Coding 的行业观察、实战教程与工具评测。</p>

      <div className="toolbar">
        <form action="/articles" method="get">
          <input
            className="grow"
            name="keyword"
            defaultValue={keyword}
            placeholder="搜索文章…"
          />
          <button className="btn" type="submit">
            搜索
          </button>
        </form>
      </div>

      <div className="grid">
        {data.list.map((a) => (
          <Link href={`/articles/${a.slug}`} className="card" key={a.ID}>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
          </Link>
        ))}
        {data.list.length === 0 && <div className="center">暂无文章</div>}
      </div>

      {totalPages > 1 && (
        <div className="pager">
          {page > 1 && <Link href={link(page - 1)}>上一页</Link>}
          <span className="active">
            {page} / {totalPages}
          </span>
          {page < totalPages && <Link href={link(page + 1)}>下一页</Link>}
        </div>
      )}
    </>
  );
}
