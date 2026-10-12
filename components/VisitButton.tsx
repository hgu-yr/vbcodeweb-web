'use client';

import { apiSend } from '@/lib/api';

export default function VisitButton({ id, url }: { id: number; url: string }) {
  const onClick = async () => {
    try {
      await apiSend(`/products/${id}/click`, 'POST');
    } catch {
      // 点击统计失败不影响跳转
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!url) return null;
  return (
    <button className="btn" style={{ width: '100%' }} onClick={onClick}>
      访问官网
    </button>
  );
}
