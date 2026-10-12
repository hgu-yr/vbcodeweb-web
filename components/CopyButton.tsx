'use client';

import { useState } from 'react';

export default function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [done, setDone] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  };

  return (
    <button
      className="btn ghost"
      style={{ width: '100%', marginTop: 8 }}
      onClick={onClick}
    >
      {done ? '已复制' : label}
    </button>
  );
}
