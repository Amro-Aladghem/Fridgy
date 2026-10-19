import { useState } from 'react';

interface ChatImageProps {
  src?: string | null;
  className?: string;
}

export function ChatImage({ src, className }: ChatImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
