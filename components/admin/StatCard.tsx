'use client';

import {LucideIcon} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'cyan' | 'violet' | 'magenta' | 'muted';
  subtitle?: string;
}

const accentColors = {
  cyan: {
    border: 'rgba(63, 232, 244, 0.3)',
    glow: 'rgba(63, 232, 244, 0.1)',
    text: '#3FE8F4',
    gradient: 'linear-gradient(135deg, #3FE8F4 0%, #5B7FFF 100%)'
  },
  violet: {
    border: 'rgba(157, 92, 255, 0.3)',
    glow: 'rgba(157, 92, 255, 0.1)',
    text: '#9D5CFF',
    gradient: 'linear-gradient(135deg, #5B7FFF 0%, #9D5CFF 100%)'
  },
  magenta: {
    border: 'rgba(230, 60, 216, 0.3)',
    glow: 'rgba(230, 60, 216, 0.1)',
    text: '#E63CD8',
    gradient: 'linear-gradient(135deg, #9D5CFF 0%, #E63CD8 100%)'
  },
  muted: {
    border: 'rgba(255, 255, 255, 0.12)',
    glow: 'rgba(255, 255, 255, 0.04)',
    text: '#8A91B0',
    gradient: 'linear-gradient(135deg, #8A91B0 0%, #F2F4FF 100%)'
  }
};

export function StatCard({
  title,
  value,
  icon: Icon,
  accent = 'cyan',
  subtitle
}: StatCardProps) {
  const colors = accentColors[accent];

  return (
    <div className="relative group">
      {/* Animated border trace */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden opacity-50"
        style={{
          background: colors.gradient,
          animation: 'border-trace 4s linear infinite'
        }}
      />
      <div
        className="absolute inset-[1px] rounded-[11px]"
        style={{background: '#05060F'}}
      />

      {/* Card content */}
      <div
        className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-sm rounded-xl border p-6"
        style={{borderColor: colors.border}}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{backgroundColor: colors.glow}}
        >
          <Icon className="w-6 h-6" style={{color: colors.text}} />
        </div>

        {/* Title */}
        <div className="text-sm text-[#8A91B0] mb-1">{title}</div>

        {/* Value */}
        <div
          className="text-3xl font-bold mb-1"
          style={{color: colors.text}}
        >
          {value}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="text-xs text-[#8A91B0]">{subtitle}</div>
        )}
      </div>

      <style jsx>{`
        @keyframes border-trace {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
