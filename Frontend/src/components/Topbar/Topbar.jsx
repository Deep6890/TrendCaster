import { Menu, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard',          sub: 'Live market overview' },
  guardian:  { title: 'Guardian AI',        sub: 'Your financial autopilot' },
  regret:    { title: 'Regret Simulator',   sub: 'See your future before it happens' },
  life:      { title: 'Life Impact',        sub: 'Real-world cost of your bets' },
  crowd:     { title: 'Crowd vs Smart Money', sub: 'Who is really winning?' },
  wait:      { title: 'Wait Power Meter',   sub: 'Patience, quantified' },
  memory:    { title: 'Mistake Memory',     sub: 'Learn from your own patterns' },
  feed:      { title: 'Daily Intelligence Feed', sub: 'One-line mentor whisper' },
  chat:      { title: 'AI Chat',            sub: 'Ask anything about the market' },
};

export default function Topbar({ onMenuClick }) {
  const { activePage, marketData } = useApp();
  const info = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white">{info.title}</h1>
          <p className="text-xs text-white/30">{info.sub}</p>
        </div>
      </div>

      {/* Right — ticker strip */}
      <div className="hidden md:flex items-center gap-4">
        {[
          { label: 'NIFTY',  ...marketData.nifty  },
          { label: 'SENSEX', ...marketData.sensex  },
          { label: 'VIX',    value: marketData.vix.value, change: marketData.vix.change, trend: marketData.vix.trend },
        ].map(t => (
          <div key={t.label} className="text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">{t.label}</p>
            <p className="text-xs font-medium text-white">
              {t.value.toLocaleString('en-IN')}
              <span className={`ml-1 text-[10px] ${t.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {t.trend === 'up' ? '▲' : '▼'}{Math.abs(t.change)}%
              </span>
            </p>
          </div>
        ))}

        {/* Live dot */}
        <div className="flex items-center gap-1.5">
          <Circle size={6} className="fill-emerald-400 text-emerald-400 animate-pulse-soft" />
          <span className="text-[10px] text-white/25">{now}</span>
        </div>
      </div>
    </header>
  );
}
