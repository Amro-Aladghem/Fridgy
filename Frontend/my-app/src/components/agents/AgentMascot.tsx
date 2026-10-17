import { cn } from '@/libs/cn';

interface AgentMascotProps {
  src: string;
  name: string;
  className?: string;
}

export function AgentMascot({ src, name, className }: AgentMascotProps) {
  return (
    <img
      src={src}
      alt={name}
      draggable={false}
      className={cn('h-auto w-full select-none', className)}
    />
  );
}
