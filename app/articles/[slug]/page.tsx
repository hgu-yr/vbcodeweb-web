import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { Article } from '@/lib/types';
import ViewPing from '@/components/ViewPing';

export const dynamic = 'force-dynamic';

// 极简 Markdown 渲染：支持标题、无序列表、段落。
function renderMarkdown(md: string) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
    if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
    if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
    return <p key={i}>{line}</p>;
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let article: Article | null = null;
  try {
    article = await apiGet<Article>(`/articles/slug/${params.slug}`);
  } catch {
    article = null;
  }

  if (!article) {
    return (
      <div className="center">
        未找到该文章，<Link href="/articles">返回列表</Link>
      </div>
    );
  }

  return (
    <article className="content" style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1>{article.title}</h1>
      <p className="meta">
        {article.published_at
          ? new Date(article.published_at).toLocaleDateString('zh-CN')
          : '未发布'}{' '}
        · 阅读 {article.view_count}
      </p>
      <div style={{ marginTop: 24 }}>{renderMarkdown(article.content || '')}</div>
      <ViewPing resource="articles" id={article.ID} />
    </article>
  );
}
