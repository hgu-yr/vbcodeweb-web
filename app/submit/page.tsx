'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiSubmit, buildQuery } from '@/lib/api';
import type { Category, PageResult } from '@/lib/types';

const KINDS = [
  { value: 2, label: '小程序', scope: 2 },
  { value: 1, label: '工具 / 网站', scope: 1 },
];

type Files = { image: File | null; code: File | null };

export default function SubmitPage() {
  const [kind, setKind] = useState(2);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Files>({ image: null, code: null });
  const [preview, setPreview] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiGet<PageResult<Category>>(`/categories${buildQuery({ size: 50 })}`)
      .then((r) => setCats(r.list))
      .catch(() => undefined);
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onPick = (which: keyof Files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFiles((s) => ({ ...s, [which]: f }));
    if (which === 'image') setPreview(f ? URL.createObjectURL(f) : '');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!(form.name || '').trim()) {
      setErr('请填写名称');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('kind', String(kind));
      [
        'name', 'tagline', 'description', 'website_url', 'pricing', 'platforms',
        'app_id', 'subject', 'builder_tool', 'guide_url', 'category_id', 'contact', 'slug',
      ].forEach((k) => {
        const v = (form[k] || '').trim();
        if (v) fd.append(k, v);
      });
      if (files.image) fd.append('image', files.image);
      if (files.code) fd.append('code', files.code);
      await apiSubmit('/submissions', fd);
      setDone(true);
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="panel center" style={{ padding: 40 }}>
        <h1>提交成功 🎉</h1>
        <p className="meta">
          感谢投稿！我们会在人工审核后上架，通过后即可在列表页看到你的作品。
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link className="btn" href="/">
            返回首页
          </Link>
          <button
            className="btn sm"
            onClick={() => {
              setDone(false);
              setForm({});
              setFiles({ image: null, code: null });
              setPreview('');
            }}
          >
            再提交一个
          </button>
        </div>
      </div>
    );
  }

  const kindCats = cats.filter((c) => c.scope === (kind === 1 ? 1 : 2));

  return (
    <>
      <h1>提交我的 Vibe Coding 作品</h1>
      <p className="sub">
        分享你用 AI 做出来的小程序或工具，审核通过后会出现在站内，让更多开发者看到。
      </p>

      <div className="tabs" style={{ marginBottom: 16 }}>
        {KINDS.map((k) => (
          <button
            key={k.value}
            className={kind === k.value ? 'active' : ''}
            onClick={() => setKind(k.value)}
            type="button"
          >
            {k.label}
          </button>
        ))}
      </div>

      {err && <p style={{ color: '#fb7185' }}>{err}</p>}

      <form className="panel" onSubmit={submit}>
        <div className="form-grid">
          <div>
            <label className="meta">名称 *</label>
            <input value={form.name || ''} onChange={(e) => set('name', e.target.value)} placeholder={kind === 1 ? '如：Cursor' : '如：每日一句'} />
          </div>

          {kind === 1 ? (
            <>
              <div>
                <label className="meta">一句话简介</label>
                <input value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} placeholder="如：AI 优先的代码编辑器" />
              </div>
              <div>
                <label className="meta">官网地址</label>
                <input value={form.website_url || ''} onChange={(e) => set('website_url', e.target.value)} placeholder="https://…" />
              </div>
              <div>
                <label className="meta">收费模式</label>
                <input value={form.pricing || ''} onChange={(e) => set('pricing', e.target.value)} placeholder="免费 / 付费 / 免费增值" />
              </div>
              <div>
                <label className="meta">支持平台</label>
                <input value={form.platforms || ''} onChange={(e) => set('platforms', e.target.value)} placeholder="Windows,macOS,Web" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="meta">作者 / 开发主体</label>
                <input value={form.subject || ''} onChange={(e) => set('subject', e.target.value)} placeholder="如：独立开发者 @阿岳" />
              </div>
              <div>
                <label className="meta">使用的 vibe coding 工具</label>
                <input value={form.builder_tool || ''} onChange={(e) => set('builder_tool', e.target.value)} placeholder="如：Cursor / Trae" />
              </div>
              <div>
                <label className="meta">详情 / 引导链接</label>
                <input value={form.guide_url || ''} onChange={(e) => set('guide_url', e.target.value)} placeholder="可选" />
              </div>
              <div>
                <label className="meta">小程序 AppID</label>
                <input value={form.app_id || ''} onChange={(e) => set('app_id', e.target.value)} placeholder="可选" />
              </div>
            </>
          )}

          <div>
            <label className="meta">分类</label>
            <select value={form.category_id || ''} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">未选择</option>
              {kindCats.map((c) => (
                <option key={c.ID} value={c.ID}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="meta">联系方式（微信 / 邮箱，仅管理员可见）</label>
            <input value={form.contact || ''} onChange={(e) => set('contact', e.target.value)} placeholder="方便我们在审核时联系你" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="meta">详细介绍</label>
            <textarea
              rows={5}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="介绍一下它解决了什么问题、有什么亮点…"
            />
          </div>

          <div>
            <label className="meta">{kind === 1 ? 'Logo 图片' : '封面图'}</label>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onPick('image')} />
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="预览" style={{ marginTop: 8, maxWidth: 160, maxHeight: 160, borderRadius: 12 }} />
            )}
          </div>

          {kind === 2 && (
            <div>
              <label className="meta">小程序码图片</label>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onPick('code')} />
            </div>
          )}
        </div>

        <p className="meta" style={{ marginTop: 14 }}>
          支持 jpg / png / webp / gif，单张不超过 4MB。
        </p>

        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 12 }}>
          {busy ? '提交中…' : '提交审核'}
        </button>
      </form>
    </>
  );
}
