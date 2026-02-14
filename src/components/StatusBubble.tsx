'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatusBubble({ className }: { className?: string }) {
  const [status, setStatus] = useState('online');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch status from Worker API
    fetch('https://melora-brain.keveon.workers.dev/status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.text || data.mood || 'online');
        setLoading(false);
      })
      .catch(() => {
        setStatus('online');
        setLoading(false);
      });
  }, []);

  const statusColor =
    {
      online: 'bg-emerald-500',
      busy: 'bg-amber-500',
      offline: 'bg-slate-400',
      away: 'bg-blue-400',
    }[status.toLowerCase()] || 'bg-emerald-500';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'bg-secondary/80 backdrop-blur-sm border border-border',
        'transition-all duration-300 hover:scale-105',
        loading && 'opacity-70',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <Activity className={cn('h-4 w-4', statusColor.replace('bg-', 'text-'))} />
        <span
          className={cn(
            'absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full',
            statusColor,
            'animate-pulse-slow'
          )}
        />
      </div>
      <span className="text-sm font-medium text-secondary-foreground capitalize">
        {loading ? '...' : status}
      </span>
    </div>
  );
}
