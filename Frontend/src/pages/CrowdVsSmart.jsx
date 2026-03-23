import { Users, Brain, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CROWD_DATA = [
  { name: 'Banking', crowd: 34, smart: 71, crowdLabel: 'Buying',        smartLabel: 'Accumulating',   alert: 'Smart accumulation while crowd cautious' },
  { name: 'IT',      crowd: 28, smart: 55, crowdLabel: 'Cautious',      smartLabel: 'Quietly buying', alert: 'Smart money returning to IT'              },
  { name: 'Pharma',  crowd: 50, smart: 50, crowdLabel: 'Mixed',         smartLabel: 'Watching',       alert: null                                      },
  { name: 'Energy',  crowd: 61, smart: 22, crowdLabel: 'Panic selling', smartLabel: 'Exiting',         alert: 'Retail panic — smart already out'         },
  { name: 'Metal',   crowd: 72, smart: 18, crowdLabel: 'FOMO buying',   smartLabel: 'Exiting',         alert: 'Dangerous — FOMO buying at top'           },
  { name: 'Realty',  crowd: 44, smart: 30, crowdLabel: 'Chasing',       smartLabel: 'Reducing',        alert: 'Both cautious — avoid'                   },
];

function BarFill({ pct, color }) {
  return (
    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function crowdColor(v) { return v > 60 ? 'bg-red-400' : v < 35 ? 'bg-emerald-400' : 'bg-yellow-400'; }

function CrowdCard({ item }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.10] transition-all">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-white">{item.name}</p>
        {item.alert && (
          <span className="flex items-center gap-1 text-[10px] text-yellow-400 border border-yellow-400/20 bg-yellow-400/10 rounded-full px-2 py-0.5">
            <AlertTriangle size={9} /> Alert
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Crowd */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-white/40">
              <Users size={11} className="shrink-0" /> Crowd — {item.crowdLabel}
            </span>
            <span className="text-white/60 font-medium">{item.crowd}%</span>
          </div>
          <BarFill pct={item.crowd} color={crowdColor(item.crowd)} />
        </div>

        {/* Smart */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-white/40">
              <Brain size={11} className="shrink-0" /> Smart Money — {item.smartLabel}
            </span>
            <span className="text-white/60 font-medium">{item.smart}%</span>
          </div>
          <BarFill pct={item.smart} color={crowdColor(100 - item.smart)} />
        </div>
      </div>

      {item.alert && (
        <p className="text-[11px] text-white/40 mt-3 border-t border-white/[0.05] pt-3">{item.alert}</p>
      )}
    </div>
  );
}

export default function CrowdVsSmart() {
  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Users size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Crowd vs Smart Money</h2>
          <p className="text-white/40 text-sm mt-0.5">See where the herd goes — and where smart money actually is</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-white/40">
        <span className="flex items-center gap-2"><span className="w-3 h-1.5 rounded bg-red-400 inline-block" />&gt;60% = Danger / FOMO</span>
        <span className="flex items-center gap-2"><span className="w-3 h-1.5 rounded bg-yellow-400 inline-block" />35–60% = Mixed / Caution</span>
        <span className="flex items-center gap-2"><span className="w-3 h-1.5 rounded bg-emerald-400 inline-block" />&lt;35% = Smart zone</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CROWD_DATA.map(item => <CrowdCard key={item.name} item={item} />)}
      </div>

      {/* Golden rule */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">The Golden Rule</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { Icon: TrendingDown, color: 'text-red-400',     text: 'When crowd buys & smart sells',   result: 'potential top'  },
            { Icon: TrendingUp,   color: 'text-emerald-400', text: 'When smart buys & crowd fears',   result: 'opportunity'   },
            { Icon: Minus,        color: 'text-yellow-400',  text: 'When both are confused',          result: 'sit tight'     },
          ].map(({ Icon, color, text, result }) => (
            <div key={result} className="flex items-start gap-2">
              <Icon size={16} className={`${color} shrink-0 mt-0.5`} strokeWidth={2} />
              <p className="text-white/60">{text} → <strong className={color}>{result}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
