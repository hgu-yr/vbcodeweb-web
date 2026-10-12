'use client';

import { useEffect } from 'react';
import { apiSend } from '@/lib/api';

// ViewPing 在详情页加载时记录一次浏览/点击，失败静默忽略。
export default function ViewPing({
  resource,
  id,
}: {
  resource: 'products' | 'mini-programs' | 'articles';
  id: number;
}) {
  useEffect(() => {
    const suffix = resource === 'articles' ? 'view' : 'click';
    apiSend(`/${resource}/${id}/${suffix}`, 'POST').catch(() => {});
  }, [resource, id]);

  return null;
}
