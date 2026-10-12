import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { MiniProgram } from '@/lib/types';
import CopyButton from '@/components/CopyButton';
import ViewPing from '@/components/ViewPing';
import ImgLogo from '@/components/ImgLogo';
import { miniLogo } from '@/lib/logo';

export const dynamic = 'force-dynamic';

export default async function MiniProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let program: MiniProgram | null = null;
  try {
    program = await apiGet<MiniProgram>(`/mini-programs/slug/${params.slug}`);
  } catch {
    program = null;
  }

  if (!program) {
    return (
      <div className="center">
        未找到该案例，<Link href="/mini-programs">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <div className="content">
        <h1>{program.name}</h1>
        <p className="meta">开发者：{program.subject || '—'}</p>
        <p style={{ marginTop: 20 }}>{program.description}</p>
      </div>

      <aside>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <ImgLogo
            src={miniLogo(program.slug)}
            name={program.name}
            size={110}
          />
        </div>
        <p className="meta" style={{ textAlign: 'center' }}>
          由 {program.builder_tool || '—'} 开发
        </p>
        <CopyButton text={program.name} label="复制小程序名称" />
        {program.guide_url ? (
          <CopyButton text={program.guide_url} label="复制详情链接" />
        ) : null}
        <p className="meta" style={{ marginTop: 12 }}>
          微信搜索名称即可体验
        </p>
      </aside>

      <ViewPing resource="mini-programs" id={program.ID} />
    </div>
  );
}
