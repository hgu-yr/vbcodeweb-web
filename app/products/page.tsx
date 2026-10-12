import Link from 'next/link';
import { apiGet, buildQuery } from '@/lib/api';
import type { Category, PageResult, Product } from '@/lib/types';
import ImgLogo from '@/components/ImgLogo';

export const dynamic = 'force-dynamic';

const SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; keyword?: string; category_id?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const keyword = searchParams.keyword || '';
  const categoryId = searchParams.category_id || '';

  let data: PageResult<Product> = { list: [], total: 0, page, size: SIZE };
  let cats: Category[] = [];
  try {
    const [res, catRes] = await Promise.all([
      apiGet<PageResult<Product>>(
        `/products${buildQuery({
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
    `/products${buildQuery({ page: p, keyword, category_id: categoryId })}`;

  return (
    <>
      <h1>Vibe Coding 工具</h1>
      <p className="sub">共 {data.total} 个工具，点击查看详情与官网直达。</p>

      <div className="toolbar">
        <form action="/products" method="get">
          <input
            className="grow"
            name="keyword"
            defaultValue={keyword}
            placeholder="搜索工具名称或简介…"
          />
          <select name="category_id" defaultValue={categoryId} style={{ width: 160 }}>
            <option value="">全部分类</option>
            {cats
              .filter((c) => c.scope === 1)
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
        {data.list.map((p) => (
          <Link href={`/products/${p.slug}`} className="card" key={p.ID}>
            <div className="row">
              <ImgLogo src={`/logos/${p.slug}.png`} name={p.name} size={36} />
              <h3>{p.name}</h3>
            </div>
            <p>{p.tagline}</p>
            <div className="tags">
              {p.pricing && <span className="tag">{p.pricing}</span>}
              {p.featured === 1 && <span className="tag">精选</span>}
            </div>
          </Link>
        ))}
        {data.list.length === 0 && <div className="center">没有找到相关工具</div>}
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
