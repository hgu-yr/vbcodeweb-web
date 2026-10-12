'use client';

import { useState } from 'react';
import BrandLogo from './BrandLogo';

// ImgLogo 优先加载真实 logo 图片，加载失败时回退到生成的兜底 logo。
export default function ImgLogo({
  src,
  name,
  size = 40,
  radius,
}: {
  src?: string;
  name: string;
  size?: number;
  radius?: number;
}) {
  const [failed, setFailed] = useState(false);
  const r = radius ?? Math.round(size * 0.24);

  if (!src || failed) {
    return <BrandLogo name={name} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{
        objectFit: 'contain',
        borderRadius: r,
        flex: 'none',
        background: '#fff',
      }}
    />
  );
}
