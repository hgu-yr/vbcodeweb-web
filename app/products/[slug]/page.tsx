import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { Product } from '@/lib/types';
import VisitButton from '@/components/VisitButton';
import ImgLogo from '@/components/ImgLogo';
import { productLogo } from '@/lib/logo';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product | null = null;
  try {
    product = await apiGet<Product>(`/products/slug/${params.slug}`);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <div className="center">
        未找到该工具，<Link href="/products">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <div className="content">
        <div className="row" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <ImgLogo src={productLogo(product.slug, product.logo)} name={product.name} size={52} />
          <div>
            <h1 style={{ margin: 0 }}>{product.name}</h1>
            <p className="meta" style={{ margin: 0 }}>
              {product.tagline}
            </p>
          </div>
        </div>
        <p style={{ marginTop: 24 }}>{product.description}</p>
      </div>

      <aside>
        <VisitButton id={product.ID} url={product.website_url} />
        <p className="meta">收费模式：{product.pricing || '—'}</p>
        <p className="meta">支持平台：{product.platforms || '—'}</p>
        <p className="meta">热度：{product.click_count} 次点击</p>
        <p className="meta">
          官网：
          {product.website_url ? (
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              链接
            </a>
          ) : (
            '—'
          )}
        </p>
      </aside>
    </div>
  );
}
