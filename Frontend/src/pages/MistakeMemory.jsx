import { BookOpen, Brain, History, AlertTriangle, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

function PatternBadge({ action }) {
  if (action.includes('peak'))   return <span className="text-[10px] text-red-400 border border-red-500/20 bg-red-500/10 rounded-full px-2 py-0.5">Bought at peak</span>;
  if (action.includes('Panic'))  return <span className="text-[10px] text-yellow-400 border border-yellow-500/20 bg-yellow-500/10 rounded-full px-2 py-0.5">Panic decision</span>;
  if (action.includes('Chased')) return <span className="text-[10px] text-orange-400 border border-orange-500/20 bg-orange-500/10 rounded-full px-2 py-0.5">Chased trend</span>;
  return null;
}

export default function MistakeMemory() {
  const { mistakeHistory } = useApp();

  const patterns = {
    'Bought at peak':     mistakeHistory.filter(m => m.action.includes('peak')).length,
    'Panic decisions':    mistakeHistory.filter(m => m.action.includes('Panic')).length,
    'Chased trends late': mistakeHistory.filter(m => m.action.includes('Chased')).length,
  };
  const topPattern = Object.entries(patterns).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <BookOpen size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Mistake Memory</h2>
          <p className="text-white/40 text-sm mt-0.5">Your AI remembers — so you don't repeat</p>
        </div>
      </div>

      {/* Top pattern warning */}
      <div className="bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-5 flex items-start gap-3">
        <Brain size={20} className="text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Your Most Common Pattern</p>
          <p className="text-lg font-bold text-red-300">{topPattern}</p>
          <p className="text-sm text-white/50 mt-1 leading-relaxed">
            This behavior has cost you money before. Next time you're about to do this, I'll warn you.
          </p>
        </div>
      </div>

      {/* Pattern bars */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">Behavior Pattern Analysis</p>
        {Object.entries(patterns).map(([label, count]) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/70">{label}</span>
              <span className="text-xs font-bold text-white">{count}×</span>
            </div>
            <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min((count / Math.max(mistakeHistory.length, 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* History timeline */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Your Loss History</p>
        <div className="space-y-4">
          {mistakeHistory.map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-white/20 mt-1 shrink-0" />
                {i < mistakeHistory.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] text-white/25">{m.date}</span>
                  <PatternBadge action={m.action} />
                </div>
                <p className="text-sm text-white/70">{m.action}</p>
                <p className="text-xs font-semibold text-red-400 mt-1">Outcome: {m.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern-based advice */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Pattern-Based Rules</p>
        <div className="space-y-3">
          {[
            { label: 'Buying at peaks',  rule: 'Only buy if price is ≥3% below recent high.' },
            { label: 'Panic selling',    rule: 'Add a 24h rule — never sell during fear. Sleep on it.' },
            { label: 'Chasing trends',   rule: 'If it moved 10%+ this week, you\'re late. Wait for next wave.' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5 border-b border-white/[0.04] pb-3 last:pb-0 last:border-0">
              <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-semibold text-white/70">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.rule}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
