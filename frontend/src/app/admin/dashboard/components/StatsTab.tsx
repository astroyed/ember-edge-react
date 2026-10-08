'use client';

import type { DashboardStats } from './types';

interface StatsTabProps {
  stats: DashboardStats | null;
}

export default function StatsTab({ stats }: StatsTabProps) {
  if (!stats) return null;

  const cards = [
    { label: 'Total Sales Revenue', value: `Rs. ${numberFormat(stats.total_revenue || 0)}` },
    { label: 'Total Orders', value: stats.total_orders || 0 },
    { label: 'Pending Orders', value: stats.pending_orders || 0 },
    { label: 'Total Products', value: stats.total_products || 0 },
  ];

  return (
    <section className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.5px] text-[#1c1c1c]">Store overview</h2>
        <p className="mt-2 text-sm text-[#5f5f5d]">Key business metrics at a glance.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="space-y-5 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 sm:p-7">
            <span className="block text-xs font-medium text-[#5f5f5d]">{card.label}</span>
            <p className="font-serif text-3xl font-semibold leading-tight tracking-[-0.8px] text-[#1c1c1c] sm:text-4xl">
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-PK').format(value);
}
