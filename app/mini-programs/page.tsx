import Link from 'next/link';
import { apiGet, buildQuery } from '@/lib/api';
import type { Category, MiniProgram, PageResult } from '@/lib/types';
import ImgLogo from '@/components/ImgLogo';
import { miniLogo } from '@/lib/logo';

export const dynamic = 'force-dynamic';

const SIZE = 12;

export default async function MiniProgramsPage({
  searchParams,
}: {
  searchParams: { page?: string; keyword?: string; category_id?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const keyword = searchParams.keyword || '';
  const categoryId = searchParams.category_id || '';

  let data: PageResult<MiniProgram> = { list: [], total: 0, page, size: SIZE };
  let cats: Category[] = [];
  try {
    const [res, catRes] = await Promise.all([
      apiGet<PageResult<MiniProgram>>(
        `/mini-programs${buildQuery({
          page,
          size: SIZE,
          keyword,
          category_id: categoryId,
          status: 1,
        })}`,
      ),
      apiGet<PageResult<Category>>(`/categories${buildQuery({ size: 50 })}`),
    ]);
    data = res;
    cats = catRes.list;
  } catch {
    // 后端不可用时展示空列表
  }

  const totalPages = Math.max(1, Math.ceil(data.total / SIZE));
  const link = (p: number) =>
    `/mini-programs${buildQuery({ page: p, keyword, category_id: categoryId })}`;

  return (
    <>
      <h1>AI 生成的小程序案例</h1>
      <p className="sub">
        共 {data.total} 个案例，均由 Vibe Coding 方式开发。
      </p>

      <div className="toolbar">
        <form action="/mini-programs" method="get">
          <input
            className="grow"
            name="keyword"
            defaultValue={keyword}
            placeholder="搜索小程序名称或工具…"
          />
          <select name="category_id" defaultValue={categoryId} style={{ width: 160 }}>
            <option value="">全部分类</option>
            {cats
              .filter((c) => c.scope === 2)
              .map((c) => (
                <option key={c.ID} value={c.ID}>
                  {c.name}
                </option>
              ))}
          </select>
          <button className="btn" type="submit">
            搜索
          </button>
        </form>
      </div>

      <div className="grid">
        {data.list.map((m) => (
          <Link href={`/mini-programs/${m.slug}`} className="card" key={m.ID}>
            <div className="brand-cover">
              <ImgLogo src={miniLogo(m.slug)} name={m.name} size={64} />
            </div>
            <h3>{m.name}</h3>
            <p>{m.description}</p>
            <div className="tags">
              {m.builder_tool && <span className="tag">由 {m.builder_tool} 生成</span>}
              {m.subject && <span className="tag">{m.subject}</span>}
            </div>
          </Link>
        ))}
        {data.list.length === 0 && <div className="center">没有找到相关案例</div>}
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
