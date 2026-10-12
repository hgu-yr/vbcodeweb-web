'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiSend, buildQuery } from '@/lib/api';
import type { PageResult } from '@/lib/types';

type Row = Record<string, unknown> & { ID: number };
type FieldType = 'text' | 'number' | 'textarea';

interface Field {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
}
interface Column {
  key: string;
  label: string;
}
interface ResourceCfg {
  label: string;
  path: string;
  columns: Column[];
  fields: Field[];
}

const RESOURCES: Record<string, ResourceCfg> = {
  products: {
    label: '工具',
    path: '/products',
    columns: [
      { key: 'name', label: '名称' },
      { key: 'slug', label: 'Slug' },
      { key: 'pricing', label: '收费' },
      { key: 'click_count', label: '点击' },
      { key: 'status', label: '状态' },
    ],
    fields: [
      { key: 'name', label: '名称', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'tagline', label: '一句话简介' },
      { key: 'website_url', label: '官网地址' },
      { key: 'logo', label: 'Logo 地址' },
      { key: 'category_id', label: '分类ID', type: 'number' },
      { key: 'pricing', label: '收费模式' },
      { key: 'platforms', label: '支持平台' },
      { key: 'description', label: '详细介绍', type: 'textarea' },
    ],
  },
  'mini-programs': {
    label: '小程序',
    path: '/mini-programs',
    columns: [
      { key: 'name', label: '名称' },
      { key: 'slug', label: 'Slug' },
      { key: 'builder_tool', label: '开发工具' },
      { key: 'click_count', label: '查看' },
      { key: 'status', label: '状态' },
    ],
    fields: [
      { key: 'name', label: '名称', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'subject', label: '开发者' },
      { key: 'builder_tool', label: '开发工具' },
      { key: 'category_id', label: '分类ID', type: 'number' },
      { key: 'guide_url', label: '详情/引导链接' },
      { key: 'mini_code_img', label: '小程序码图片' },
      { key: 'cover', label: '封面图' },
      { key: 'description', label: '介绍', type: 'textarea' },
    ],
  },
  articles: {
    label: '文章',
    path: '/articles',
    columns: [
      { key: 'title', label: '标题' },
      { key: 'slug', label: 'Slug' },
      { key: 'status', label: '状态' },
      { key: 'view_count', label: '阅读' },
    ],
    fields: [
      { key: 'title', label: '标题', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'summary', label: '摘要' },
      { key: 'category_id', label: '分类ID', type: 'number' },
      { key: 'status', label: '状态(1发布/0草稿)', type: 'number' },
      { key: 'content', label: '正文(Markdown)', type: 'textarea' },
    ],
  },
  categories: {
    label: '分类',
    path: '/categories',
    columns: [
      { key: 'name', label: '名称' },
      { key: 'slug', label: 'Slug' },
      { key: 'scope', label: '归属' },
      { key: 'sort', label: '排序' },
    ],
    fields: [
      { key: 'name', label: '名称', required: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'scope', label: '归属(1工具/2小程序/3文章)', type: 'number' },
      { key: 'sort', label: '排序', type: 'number' },
    ],
  },
};

const TABS = Object.keys(RESOURCES);

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [tab, setTab] = useState(TABS[0]);
  const [list, setList] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const cfg = RESOURCES[tab];

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    const u = localStorage.getItem('user');
    if (u) {
      try {
        setUsername(JSON.parse(u).username);
      } catch {
        // 忽略解析错误
      }
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await apiGet<PageResult<Row>>(
        `${cfg.path}${buildQuery({ size: 100 })}`,
      );
      setList(res.list);
      setTotal(res.total);
    } catch (e) {
      setMsg((e as Error).message);
    }
  }, [cfg.path]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const onDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm('确定删除？')) return;
    try {
      await apiSend(`${cfg.path}/${id}`, 'DELETE', undefined, token);
      setMsg('删除成功');
      load();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const body: Record<string, unknown> = {};
    cfg.fields.forEach((f) => {
      const v = form[f.key];
      if (v === undefined || v === '') return;
      body[f.key] = f.type === 'number' ? Number(v) : v;
    });
    try {
      await apiSend(cfg.path, 'POST', body, token);
      setMsg('新增成功');
      setForm({});
      setShowForm(false);
      load();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="center">
        请先登录，<Link href="/login">前往登录</Link>
      </div>
    );
  }

  return (
    <>
      <div className="section-head">
        <h1>后台管理</h1>
        <span className="meta">
          {username} ·{' '}
          <a
            onClick={logout}
            style={{ cursor: 'pointer', color: 'var(--brand)' }}
          >
            退出登录
          </a>
        </span>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={t === tab ? 'active' : ''}
            onClick={() => {
              setTab(t);
              setShowForm(false);
              setForm({});
              setMsg('');
            }}
          >
            {RESOURCES[t].label}
          </button>
        ))}
      </div>

      {msg && <p className="meta">{msg}</p>}

      <div className="panel">
        <div className="section-head">
          <h2>
            {cfg.label}（{total}）
          </h2>
          <button className="btn sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? '收起' : '+ 新增'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={onCreate}
            className="form-grid"
            style={{ marginBottom: 20 }}
          >
            {cfg.fields.map((f) => (
              <div
                key={f.key}
                style={{ gridColumn: f.type === 'textarea' ? '1 / -1' : 'auto' }}
              >
                <label className="meta">
                  {f.label}
                  {f.required ? ' *' : ''}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={form[f.key] || ''}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={form[f.key] || ''}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <button className="btn" type="submit">
                保存
              </button>
            </div>
          </form>
        )}

        <table>
          <thead>
            <tr>
              {cfg.columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.ID}>
                {cfg.columns.map((c) => (
                  <td key={c.key}>{String(row[c.key] ?? '')}</td>
                ))}
                <td>
                  <button
                    className="btn sm danger"
                    onClick={() => onDelete(row.ID)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="center">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
