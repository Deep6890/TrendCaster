import { useState } from 'react';
import { Telescope, TrendingUp, TrendingDown, Minus, AlertTriangle, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SCENARIO_CONFIG = {
  best:   { Icon: TrendingUp,   color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.06]' },
  likely: { Icon: Minus,        color: 'text-yellow-400',  border: 'border-yellow-500/20',  bg: 'bg-yellow-500/[0.06]'  },
  worst:  { Icon: TrendingDown, color: 'text-red-400',     border: 'border-red-500/20',     bg: 'bg-red-500/[0.06]'     },
};

function ScenarioCard({ type, data }) {
  const { Icon, color, border, bg } = SCENARIO_CONFIG[type];
  return (
    <div className={`flex-1 rounded-2xl border p-5 ${bg} ${border} animate-slide-up`}>
      <Icon size={20} className={`${color} mb-3`} strokeWidth={1.5} />
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{data.label}</p>
      <p className={`text-3xl font-bold ${color} mt-2`}>{data.pct}</p>
      <p className="text-sm font-medium text-white mt-1">{data.value}</p>
      <p className="text-xs text-white/40 mt-3 leading-relaxed border-t border-white/[0.06] pt-3">{data.note}</p>
    </div>
  );
}

export default function RegretSimulator() {
  const { regretAsset, setRegretAsset, regretAmount, setRegretAmount, regretFutures, simulateRegret, sectors } = useApp();
  const [localAsset, setLocalAsset] = useState(regretAsset);
  const [localAmt,   setLocalAmt]   = useState(regretAmount || '5000');

  const handleSimulate = () => {
    setRegretAsset(localAsset);
    setRegretAmount(localAmt);
    simulateRegret(localAsset, localAmt);
  };

  const sentiment = localAsset
    ? sectors.find(s => s.name.toLowerCase().includes(localAsset.toLowerCase()))?.sentiment
    : null;

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Telescope size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Future Regret Simulator</h2>
          <p className="text-white/40 text-sm mt-0.5">See what might happen before you commit your money</p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">Run Simulation</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Asset / Sector</label>
            <select
              value={localAsset}
              onChange={e => setLocalAsset(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-all"
            >
              <option value="">Choose…</option>
              {sectors.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              <option value="Gold">Gold</option>
              <option value="Crude Oil">Crude Oil</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Investment (₹)</label>
            <input
              type="number"
              value={localAmt}
              onChange={e => setLocalAmt(e.target.value)}
              placeholder="5000"
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Entry feeling preview */}
        {sentiment && (
          <div className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 ${
            sentiment.includes('accumulation') || sentiment.includes('Calm') ? 'bg-emerald-500/10 text-emerald-400'
            : sentiment.includes('panic') || sentiment.includes('Risky')   ? 'bg-red-500/10 text-red-400'
            : 'bg-yellow-500/10 text-yellow-400'
          }`}>
            <Minus size={12} />
            Entry type detected: <strong>{sentiment}</strong>
          </div>
        )}

        <button
          onClick={handleSimulate}
          disabled={!localAsset || !localAmt}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Telescope size={15} strokeWidth={2} />
          Simulate My Future
        </button>
      </div>

      {/* Scenarios */}
      {regretFutures && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            3 Possible Futures for ₹{parseFloat(localAmt).toLocaleString('en-IN')} in {localAsset}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <ScenarioCard type="best"   data={regretFutures.best}   />
            <ScenarioCard type="likely" data={regretFutures.likely} />
            <ScenarioCard type="worst"  data={regretFutures.worst}  />
          </div>

          {/* Regret warning */}
          {(regretFutures.likely.note.includes('regret') || ['Energy','Realty','Metal'].includes(localAsset)) && (
            <div className="flex items-start gap-3 bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-4">
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-red-300 leading-relaxed">
                Most beginners regret entering at this stage. The "Most Likely" scenario is slow movement or loss.
                You might want to wait for a better setup.
              </p>
            </div>
          )}

          {/* If I were you */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
            <UserRound size={18} className="text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">If I Were You</p>
              <p className="text-sm text-white/70 leading-relaxed">
                {regretFutures.worst.pct.startsWith('-') && parseInt(regretFutures.worst.pct) < -15
                  ? `If I had your money, I would wait 3–5 more days before investing in ${localAsset}. The downside risk is too high for the potential reward right now.`
                  : `If I had your money, I'd consider a small entry — maybe 30% of your planned amount — and wait to see direction.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
