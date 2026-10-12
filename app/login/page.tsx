'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiSend } from '@/lib/api';
import type { LoginResult } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await apiSend<LoginResult>('/auth/login', 'POST', {
        username,
        password,
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      router.push('/admin');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '60px auto' }}>
      <div className="panel">
        <h2>管理员登录</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="error">{err}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? '登录中…' : '登录'}
          </button>
        </form>
        <p className="meta" style={{ marginTop: 14 }}>
          默认账号：admin / admin123
        </p>
      </div>
    </div>
  );
}
