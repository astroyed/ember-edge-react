'use client';

import type { DashboardStats } from './types';

interface StatsTabProps {
  stats: DashboardStats | null;
}

export default function StatsTab({ stats }: StatsTabProps) {
  if (!stats) return null;

  const cards = [
    { label: 'Total Sales Revenue', value: `Rs. ${numberFormat(stats.total_revenue || 0)}`, highlight: true },
    { label: 'Total Orders', value: stats.total_orders || 0 },
    { label: 'Pending Orders', value: stats.pending_orders || 0, highlight: true },
    { label: 'Total Products', value: stats.total_products || 0 },
  ];

  return (
    <section className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="space-y-2 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5f5f5d]">{card.label}</span>
            <p className={`text-2xl font-mono font-bold ${card.highlight ? 'text-[#e58a2b]' : 'text-[#1c1c1c]'}`}>
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
