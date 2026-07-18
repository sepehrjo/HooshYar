'use client';

import {useAdminLocale} from '@/hooks/useAdminLocale';

export function ChatEmptyState() {
  const {t} = useAdminLocale();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 h-full">
      <svg
        viewBox="0 0 200 120"
        className="w-48 h-28 mb-6 opacity-60"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="chat-neural-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3FE8F4" />
            <stop offset="50%" stopColor="#9D5CFF" />
            <stop offset="100%" stopColor="#E63CD8" />
          </linearGradient>
        </defs>
        {[
          [30, 30],
          [80, 20],
          [130, 35],
          [170, 25],
          [50, 70],
          [100, 85],
          [150, 65],
          [70, 100],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="4"
            fill="url(#chat-neural-grad)"
            opacity="0.9"
          />
        ))}
        {[
          [30, 30, 80, 20],
          [80, 20, 130, 35],
          [130, 35, 170, 25],
          [30, 30, 50, 70],
          [80, 20, 100, 85],
          [130, 35, 150, 65],
          [50, 70, 100, 85],
          [100, 85, 150, 65],
          [50, 70, 70, 100],
          [100, 85, 70, 100],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={`l-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#chat-neural-grad)"
            strokeWidth="1"
            opacity="0.35"
          />
        ))}
      </svg>
      <p className="text-[#8A91B0] text-sm">{t('noChats')}</p>
    </div>
  );
}
