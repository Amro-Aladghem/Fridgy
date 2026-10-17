import { Loader2 } from 'lucide-react';
import { cn } from '@/libs/cn';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={cn('animate-spin', className)} size={18} />;
}
