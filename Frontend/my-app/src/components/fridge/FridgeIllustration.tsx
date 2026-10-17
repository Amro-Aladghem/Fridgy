import type { ReactNode } from 'react';
import { cn } from '@/libs/cn';

interface FridgeIllustrationProps {
  open: boolean;
  onToggle: () => void;
  label: string;
  closeLabel: string;
  children: ReactNode;
}

function FridgeInterior() {
  return (
    <svg
      viewBox="0 0 300 430"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="fridgeInterior" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef5ee" />
          <stop offset="100%" stopColor="#e2ece3" />
        </linearGradient>
      </defs>

      <ellipse cx="150" cy="424" rx="118" ry="10" fill="#000000" opacity="0.08" />

      <rect x="14" y="6" width="272" height="414" rx="24" fill="#f2f5f1" />
      <rect
        x="14"
        y="6"
        width="272"
        height="414"
        rx="24"
        fill="none"
        stroke="#d3dbd2"
        strokeWidth="3"
      />

      <rect x="34" y="30" width="232" height="368" rx="14" fill="url(#fridgeInterior)" />
      <rect
        x="34"
        y="30"
        width="232"
        height="368"
        rx="14"
        fill="none"
        stroke="#cfdacf"
        strokeWidth="2"
      />

      <rect x="44" y="42" width="212" height="3" rx="1.5" fill="#d8e2d8" opacity="0.7" />

      <rect x="42" y="152" width="216" height="8" rx="4" fill="#dbe5db" />
      <rect x="42" y="244" width="216" height="8" rx="4" fill="#dbe5db" />
      <rect x="42" y="336" width="216" height="8" rx="4" fill="#dbe5db" />

      <rect x="42" y="160" width="216" height="2" fill="#c7d4c7" opacity="0.5" />
      <rect x="42" y="252" width="216" height="2" fill="#c7d4c7" opacity="0.5" />
      <rect x="42" y="344" width="216" height="2" fill="#c7d4c7" opacity="0.5" />

      <rect x="42" y="390" width="216" height="6" rx="3" fill="#d3ded3" />
    </svg>
  );
}

function FridgeDoor() {
  return (
    <svg
      viewBox="0 0 300 430"
      className="h-full w-full drop-shadow-xl"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="fridgeDoor" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#34a05c" />
          <stop offset="55%" stopColor="#27864b" />
          <stop offset="100%" stopColor="#1c6b3b" />
        </linearGradient>
        <linearGradient id="fridgeDoorShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect x="14" y="6" width="272" height="414" rx="24" fill="url(#fridgeDoor)" />
      <rect x="14" y="6" width="272" height="414" rx="24" fill="url(#fridgeDoorShine)" />
      <rect
        x="14"
        y="6"
        width="272"
        height="414"
        rx="24"
        fill="none"
        stroke="#175f34"
        strokeWidth="2"
      />

      <rect x="30" y="22" width="240" height="150" rx="14" fill="#ffffff" opacity="0.06" />
      <rect x="30" y="184" width="240" height="218" rx="14" fill="#000000" opacity="0.05" />

      <g opacity="0.9">
        <circle cx="150" cy="40" r="6" fill="#ffffff" opacity="0.55" />
        <rect x="138" y="30" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
      </g>
    </svg>
  );
}

export function FridgeIllustration({
  open,
  onToggle,
  label,
  closeLabel,
  children,
}: FridgeIllustrationProps) {
  return (
    <div className="mx-auto w-full max-w-[320px]" style={{ perspective: '1500px' }}>
      <div className="relative aspect-[300/430] w-full">
        <FridgeInterior />

        <div
          className={cn('absolute', open ? 'pointer-events-auto' : 'pointer-events-none')}
          style={{ zIndex: 10, top: '8%', right: '12%', bottom: '8%', left: '12%' }}
        >
          <div className="fridge-scroll h-full overflow-y-auto overscroll-contain px-0.5 pb-1">
            {open && children}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={label}
          aria-expanded={open}
          className="absolute inset-0 block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          style={{
            zIndex: 20,
            transformOrigin: 'left center',
            transform: open ? 'rotateY(-112deg)' : 'rotateY(0deg)',
            transition: 'transform 720ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            backfaceVisibility: 'hidden',
          }}
        >
          <FridgeDoor />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? closeLabel : label}
          aria-expanded={open}
          style={{ right: '6%', zIndex: 30 }}
          className={cn(
            'absolute top-1/2 flex h-32 w-3.5 -translate-y-1/2 items-center justify-center rounded-md bg-primary shadow-md ring-1 ring-primary-dark/30',
            'transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          )}
        >
          <span className="h-16 w-0.5 rounded-full bg-white/50" />
        </button>
      </div>
    </div>
  );
}
