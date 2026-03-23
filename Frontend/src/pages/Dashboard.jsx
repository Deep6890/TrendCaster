import {
  TrendingUp, TrendingDown, Minus,
  Radio, ArrowRight, Shield, Telescope, Timer, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function Ticker({ label, value, change, trend, prefix = '' }) {
  const up = trend === 'up';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-all duration-200 hover:-translate-y-0.5">
      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        <Icon size={12} strokeWidth={2.5} />
        <span>{Math.abs(change)}%</span>
        <span className="text-white/20 font-normal ml-1">today</span>
      </div>
    </div>
  );
}

function SectorRow({ sector }) {
  const up = sector.trend === 'up';
  const flat = sector.trend === 'flat';
  const TrendIcon = up ? TrendingUp : flat ? Minus : TrendingDown;
  const sentimentColor =
    sector.sentiment === 'Smart accumulation' || sector.sentiment === 'Calm entry'
      ? 'text-emerald-400'
      : sector.sentiment === 'Retail panic' || sector.sentiment === 'Risky chase' || sector.sentiment === 'FOMO exit'
      ? 'text-red-400'
      : 'text-yellow-400';

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-6 text-center text-xs text-white/25">#{sector.rank}</span>
        <span className="text-sm font-medium text-white">{sector.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
          up   ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : flat ? 'bg-yellow-500/10  text-yellow-400  border-yellow-500/20'
          :        'bg-red-500/10     text-red-400     border-red-500/20'
        }`}>
          <TrendIcon size={10} strokeWidth={2.5} />
          {sector.trend}
        </span>
        <span className={`text-xs ${sentimentColor} hidden sm:block`}>{sector.sentiment}</span>
        <span className="text-sm font-bold text-white/60 w-8 text-right">{sector.score}</span>
      </div>
    </div>
  );
}

function VixGauge({ value }) {
  const level = value < 12 ? 'Ultra Calm' : value < 16 ? 'Calm' : value < 20 ? 'Caution' : 'Fear Zone';
  const color = value < 12 ? '#22c55e' : value < 16 ? '#86efac' : value < 20 ? '#fbbf24' : '#ef4444';
  const pct   = Math.min((value / 30) * 100, 100);
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">VIX — Fear Index</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full border"
          style={{ color, borderColor: color + '40', background: color + '14' }}>
          {level}
        </span>
      </div>
      <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,#22c55e,${color})` }} />
      </div>
      <div className="flex justify-between text-[10px] text-white/20 mt-1">
        <span>0 Calm</span><span>30 Fear</span>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { page:'guardian', Icon: Shield,    title:'Guardian AI',      sub:'Set your financial autopilot',      badge:'PROTECT'  },
  { page:'regret',   Icon: Telescope, title:'Regret Simulator', sub:'See your future before you invest',  badge:'SIMULATE' },
  { page:'wait',     Icon: Timer,     title:'Wait Power',       sub:'Quantify the value of patience',    badge:'PATIENCE' },
  { page:'memory',   Icon: BookOpen,  title:'Mistake Memory',   sub:'Your past loss patterns',           badge:'LEARN'    },
];

export default function Dashboard() {
  const { marketData, sectors, dailyFeed, setActivePage } = useApp();
  const todayFeed = dailyFeed[new Date().getDay() % dailyFeed.length];

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

      {/* Daily Intelligence Banner */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-start gap-3">
        <Radio size={16} className="text-white/40 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Today's Market Whisper</p>
          <p className="text-sm text-white/80 leading-relaxed">{todayFeed}</p>
        </div>
        <button
          onClick={() => setActivePage('chat')}
          className="ml-auto shrink-0 flex items-center gap-1.5 text-xs text-white/30 hover:text-white px-3 py-1.5 border border-white/[0.08] rounded-lg transition-all hover:border-white/20"
        >
          Ask AI <ArrowRight size={12} />
        </button>
      </div>

      {/* Market Tickers */}
      <div>
        <p className="text-xs text-white/25 uppercase tracking-widest mb-3">Live Market</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Ticker label="Nifty 50"  {...marketData.nifty}   />
          <Ticker label="Sensex"    {...marketData.sensex}  />
          <Ticker label="Gold"      {...marketData.gold}    prefix="₹" />
          <Ticker label="Crude Oil" {...marketData.crude}   prefix="₹" />
          <Ticker label="USD/INR"   {...marketData.usd_inr} prefix="₹" />
          <VixGauge value={marketData.vix.value} />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sector Intelligence */}
        <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-white">Sector Intelligence</p>
            <button onClick={() => setActivePage('crowd')} className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-all">
              View crowd analysis <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {sectors.map(s => <SectorRow key={s.name} sector={s} />)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {QUICK_ACTIONS.map(({ page, Icon, title, sub, badge }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className="w-full flex items-center gap-3 p-4 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/[0.10] transition-all">
                <Icon size={15} className="text-white/60 group-hover:text-white/90" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-white/30">{sub}</p>
              </div>
              <span className="text-[10px] text-white/20 border border-white/[0.08] rounded-full px-2 py-0.5 shrink-0">{badge}</span>
            </button>
          ))}
          {/* Chat CTA */}
          <button
            onClick={() => setActivePage('chat')}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-white text-black rounded-2xl font-semibold text-sm hover:bg-white/90 transition-all hover:-translate-y-0.5 group"
          >
            Ask TrendCaster AI
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
