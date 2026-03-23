import { useState } from 'react';
import { Gamepad2, Calculator, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const REAL_THINGS = [
  { icon: '🍛', label: 'Days of food',       costPerUnit: 200  },
  { icon: '📱', label: 'Months of recharge', costPerUnit: 199  },
  { icon: '🛵', label: 'Litres of petrol',   costPerUnit: 103  },
  { icon: '🎬', label: 'Movie outings',       costPerUnit: 350  },
  { icon: '☕', label: 'Coffees',             costPerUnit: 100  },
  { icon: '📚', label: 'Books',               costPerUnit: 250  },
  { icon: '🏥', label: 'Doctor visits',       costPerUnit: 500  },
  { icon: '🧴', label: 'Skincare products',   costPerUnit: 600  },
];

export default function LifeImpact() {
  const { lifeAmount, setLifeAmount } = useApp();
  const [amt, setAmt]               = useState(lifeAmount);
  const [calculated, setCalculated] = useState(false);

  const amount = parseFloat(amt) || 0;

  const handleCalc = () => {
    setLifeAmount(amt);
    setCalculated(true);
  };

  const riskBand = amount < 2000 ? 'safe' : amount < 10000 ? 'moderate' : 'high';

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Gamepad2 size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Life Impact Mode</h2>
          <p className="text-white/40 text-sm mt-0.5">See your investment in real-world terms</p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">If This Investment Goes Wrong…</p>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-white/40 mb-1.5 block">Amount you plan to invest (₹)</label>
            <input
              type="number"
              value={amt}
              onChange={e => { setAmt(e.target.value); setCalculated(false); }}
              placeholder="e.g. 5000"
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-lg font-bold text-white outline-none focus:border-white/30 transition-all placeholder:text-white/20 placeholder:font-normal placeholder:text-sm"
            />
          </div>
          <button
            onClick={handleCalc}
            disabled={!amt || amount <= 0}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Calculator size={15} strokeWidth={2} />
            Calculate
          </button>
        </div>

        {amount > 0 && (
          <p className="text-xs text-white/30">
            ₹{amount.toLocaleString('en-IN')} at risk = your hard-earned money, not just a number.
          </p>
        )}
      </div>

      {/* Real life breakdown */}
      {calculated && amount > 0 && (
        <div className="space-y-3 animate-slide-up">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            If You Lose ₹{amount.toLocaleString('en-IN')}, That Equals:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REAL_THINGS.map((thing) => {
              const count = Math.round(amount / thing.costPerUnit);
              if (count < 1) return null;
              return (
                <div key={thing.label} className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] transition-all text-center">
                  <span className="text-2xl block mb-2">{thing.icon}</span>
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-xs text-white/40 mt-0.5">{thing.label}</p>
                </div>
              );
            })}
          </div>

          {/* Emotional impact */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-2.5 text-sm text-white/60 leading-relaxed">
            <p className="text-sm font-semibold text-white mb-3">The Real Question</p>
            <p>🤔 &nbsp;Is the potential gain worth losing <strong className="text-white">{Math.round(amount / 200)} days of food</strong>?</p>
            <p>💭 &nbsp;Most retail investors risk <strong className="text-white">money they can't afford to lose</strong> on assets they don't fully understand.</p>
            <p>✅ &nbsp;If this won't affect your daily life if lost — you're in a healthy zone.</p>
          </div>

          {/* Band verdict */}
          <div className={`flex items-start gap-3 rounded-2xl p-4 border ${
            riskBand === 'safe'     ? 'bg-emerald-500/[0.06] border-emerald-500/20'
            : riskBand === 'moderate' ? 'bg-yellow-500/[0.06] border-yellow-500/20'
            :                          'bg-red-500/[0.06]     border-red-500/20'
          }`}>
            {riskBand === 'safe'
              ? <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              : riskBand === 'moderate'
              ? <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
            }
            <p className={`text-sm leading-relaxed ${
              riskBand === 'safe'     ? 'text-emerald-300'
              : riskBand === 'moderate' ? 'text-yellow-300'
              :                          'text-red-300'
            }`}>
              {riskBand === 'safe'
                ? 'Small, manageable amount. Great for learning without major risk.'
                : riskBand === 'moderate'
                ? 'Moderate amount. Make sure you have 3 months emergency fund before investing this.'
                : 'Large amount. Only invest this if you have a clear thesis and can afford to lose it all.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
