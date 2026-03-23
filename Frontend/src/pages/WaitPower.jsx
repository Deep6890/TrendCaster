import { useState } from 'react';
import { Timer, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const WAIT_DATA = {
  1:  { improvement: 12, confidence: 38, label: '1 day',   verdict: 'Very marginal. Market still forming direction.', level: 'low'  },
  2:  { improvement: 27, confidence: 52, label: '2 days',  verdict: 'Some key support/resistance levels forming.',    level: 'low'  },
  3:  { improvement: 41, confidence: 64, label: '3 days',  verdict: 'Significant improvement. Most noise filters out. Recommended.', level: 'mid' },
  5:  { improvement: 58, confidence: 74, label: '5 days',  verdict: 'Strong improvement. Weekly trend becomes clearer.', level: 'good' },
  7:  { improvement: 70, confidence: 82, label: '7 days',  verdict: 'Entry quality almost optimal. What professionals do.', level: 'good' },
  10: { improvement: 78, confidence: 87, label: '10 days', verdict: 'Excellent. Only enter extremely high-conviction trades.', level: 'good' },
};

export default function WaitPower() {
  const [days, setDays] = useState(3);
  const data = WAIT_DATA[days] || WAIT_DATA[3];

  const VerdictIcon = data.level === 'good' ? CheckCircle : data.level === 'mid' ? AlertTriangle : Clock;
  const iconColor   = data.level === 'good' ? 'text-emerald-400' : data.level === 'mid' ? 'text-yellow-400' : 'text-white/40';
  const bgClass     = data.level === 'good' ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                    : data.level === 'mid'  ? 'bg-yellow-500/[0.06] border-yellow-500/20'
                    :                         'bg-white/[0.02] border-white/[0.06]';
  const textClass   = data.level === 'good' ? 'text-emerald-300'
                    : data.level === 'mid'  ? 'text-yellow-300'
                    : 'text-white/60';

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Timer size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Wait Power Meter</h2>
          <p className="text-white/40 text-sm mt-0.5">Nobody teaches waiting. Until now.</p>
        </div>
      </div>

      {/* Hero quote */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Timer size={36} className="text-white/20 mx-auto mb-3" strokeWidth={1} />
        <p className="text-sm text-white/50 leading-relaxed">
          Most traders lose not because they're dumb —<br />
          but because they entered <strong className="text-white">2 days too early</strong>.
        </p>
      </div>

      {/* Slider */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-5">
        <div className="flex justify-between items-center">
          <p className="text-sm text-white/70">How many days can you wait?</p>
          <span className="text-xl font-bold text-white">{days} {days === 1 ? 'day' : 'days'}</span>
        </div>
        <input
          type="range" min={1} max={10} step={1}
          value={days}
          onChange={e => setDays(+e.target.value)}
          className="w-full bg-white/10"
        />
        <div className="flex justify-between text-[10px] text-white/20">
          <span>1 day</span><span>10 days</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Entry Quality Improves By</p>
          <p className="text-4xl font-bold text-white mb-1">{data.improvement}%</p>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mt-3">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${data.improvement}%` }} />
          </div>
        </div>
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Decision Confidence</p>
          <p className="text-4xl font-bold text-white mb-1">{data.confidence}%</p>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mt-3">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${data.confidence}%` }} />
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`flex items-start gap-3 rounded-2xl p-5 border ${bgClass}`}>
        <VerdictIcon size={18} className={`${iconColor} shrink-0 mt-0.5`} strokeWidth={1.5} />
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">If you wait {data.label}…</p>
          <p className={`text-sm leading-relaxed ${textClass}`}>{data.verdict}</p>
        </div>
      </div>

      {/* Cost of impatience */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">The Real Cost of Impatience</p>
        <div className="space-y-3">
          {[
            { label: 'Buying before trend confirms',  cost: '↓ Avg -7% worse entry'  },
            { label: 'Entering on emotion/FOMO',      cost: '↓ Avg -11% worse entry' },
            { label: 'Ignoring the wait meter',       cost: '↓ Up to -22% vs patient entry' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center border-b border-white/[0.04] pb-3 last:pb-0 last:border-0">
              <p className="text-sm text-white/60">{item.label}</p>
              <span className="text-xs font-semibold text-red-400 shrink-0 ml-3">{item.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
