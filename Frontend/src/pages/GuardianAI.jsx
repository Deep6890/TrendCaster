import { useState } from 'react';
import { Shield, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, XCircle, History, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RISK_LABELS = ['', 'Scared', 'Careful', 'Chill', 'Aggressive'];
const RISK_COLORS = ['', 'text-emerald-400', 'text-blue-400', 'text-yellow-400', 'text-red-400'];

export default function GuardianAI() {
  const {
    income, setIncome,
    riskLevel, setRiskLevel,
    autopilotOn, setAutopilotOn,
    investmentAmount, setInvestmentAmount,
    selectedAsset, setSelectedAsset,
    guardianDecision, evaluateGuardian,
    frictionActive, setFrictionActive, frictionQuestion,
    sectors,
  } = useApp();

  const [assetInput, setAssetInput] = useState(selectedAsset);
  const [amtInput, setAmtInput]   = useState(investmentAmount);
  const [frictionAnswer, setFrictionAnswer] = useState(null);

  const handleEvaluate = () => {
    if (!assetInput || !amtInput) return;
    setSelectedAsset(assetInput);
    setInvestmentAmount(amtInput);
    setFrictionAnswer(null);
    evaluateGuardian(assetInput, amtInput);
  };

  const handleFriction = (answer) => {
    setFrictionAnswer(answer);
    setFrictionActive(false);
  };

  const safeCap = Math.round(income * [0, 0.05, 0.10, 0.20, 0.30][riskLevel]);

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Shield size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Financial Autopilot</h2>
          <p className="text-white/40 text-sm mt-0.5">AI with authority — not passive advice</p>
        </div>
      </div>

      {/* Autopilot Toggle */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Guardian Mode</p>
          <p className="text-xs text-white/40 mt-0.5">When ON, I can block unsafe investments</p>
        </div>
        <button
          onClick={() => setAutopilotOn(v => !v)}
          className="transition-all duration-300 flex items-center"
          aria-label="Toggle Guardian Mode"
        >
          {autopilotOn
            ? <ToggleRight size={36} className="text-white" strokeWidth={1.5} />
            : <ToggleLeft  size={36} className="text-white/30" strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Profile Setup */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-5">
        <p className="text-xs text-white/30 uppercase tracking-widest">Your Financial Profile</p>

        {/* Income slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Monthly Income</label>
            <span className="text-sm font-bold text-white">₹{income.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range" min={10000} max={500000} step={5000}
            value={income}
            onChange={e => setIncome(+e.target.value)}
            className="w-full bg-white/10"
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>₹10K</span><span>₹5L</span>
          </div>
        </div>

        {/* Risk slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Risk Comfort</label>
            <span className={`text-sm font-bold ${RISK_COLORS[riskLevel]}`}>{RISK_LABELS[riskLevel]}</span>
          </div>
          <input
            type="range" min={1} max={4} step={1}
            value={riskLevel}
            onChange={e => setRiskLevel(+e.target.value)}
            className="w-full bg-white/10"
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>Scared 😨</span><span>Aggressive 🔥</span>
          </div>
        </div>
      </div>

      {/* Trade Evaluator */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest">Evaluate a Trade</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Asset / Sector</label>
            <select
              value={assetInput}
              onChange={e => setAssetInput(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-all"
            >
              <option value="">Choose asset…</option>
              {sectors.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              <option value="Gold">Gold</option>
              <option value="Crude Oil">Crude Oil</option>
              <option value="Nifty 50">Nifty 50</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Amount (₹)</label>
            <input
              type="number"
              value={amtInput}
              onChange={e => setAmtInput(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={!assetInput || !amtInput}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Shield size={15} strokeWidth={2} />
          Ask Guardian AI
        </button>

        <p className="text-center text-xs text-white/25">
          Your safe cap: <span className="text-white/50 font-medium">₹{safeCap.toLocaleString('en-IN')}/month</span>
        </p>
      </div>

      {/* Friction System */}
      {frictionActive && (
        <div className="bg-yellow-500/[0.06] border border-yellow-500/25 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-300 mb-2">⚡ Decision Friction — Slow Down</p>
              <p className="text-sm text-white/70 leading-relaxed">{frictionQuestion}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleFriction('yes')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <XCircle size={13} /> Yes — reduce amount
                </button>
                <button
                  onClick={() => handleFriction('no')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.06] border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-all"
                >
                  <CheckCircle size={13} /> No, I'm clear-headed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guardian Decision */}
      {guardianDecision && !frictionActive && (
        <div className={`rounded-2xl p-5 animate-slide-up border ${
          guardianDecision.guardianBlocked
            ? 'bg-red-500/[0.06] border-red-500/25'
            : guardianDecision.requested <= guardianDecision.safeAmount
            ? 'bg-emerald-500/[0.06] border-emerald-500/25'
            : 'bg-yellow-500/[0.06] border-yellow-500/25'
        }`}>
          <div className="flex gap-3">
            {guardianDecision.guardianBlocked
              ? <XCircle size={22} className="text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              : guardianDecision.requested <= guardianDecision.safeAmount
              ? <CheckCircle size={22} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              : <AlertTriangle size={22} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.5} />
            }
            <div className="flex-1 space-y-3">
              <p className={`text-sm font-semibold leading-relaxed ${
                guardianDecision.guardianBlocked ? 'text-red-300'
                : guardianDecision.requested <= guardianDecision.safeAmount ? 'text-emerald-300'
                : 'text-yellow-300'
              }`}>{guardianDecision.message}</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Requested',  value: `₹${guardianDecision.requested.toLocaleString('en-IN')}`, cls: 'text-white' },
                  { label: 'Safe Limit', value: `₹${guardianDecision.safeAmount.toLocaleString('en-IN')}`, cls: 'text-emerald-400' },
                  { label: 'Entry Type', value: guardianDecision.entryType, cls: 'text-white' },
                ].map(item => (
                  <div key={item.label} className="bg-black/30 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-white/30 uppercase">{item.label}</p>
                    <p className={`text-xs font-bold mt-1 ${item.cls}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {guardianDecision.pastMistake && (
                <div className="flex items-start gap-2 bg-black/20 rounded-xl p-3">
                  <History size={14} className="text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white/60 mb-0.5">Similar to your past loss pattern</p>
                    <p className="text-xs text-white/40">"{guardianDecision.pastMistake.action}" → {guardianDecision.pastMistake.outcome}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {frictionAnswer === 'yes' && (
        <div className="flex items-center gap-2 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-4 text-sm text-emerald-300 animate-fade-in">
          <CheckCircle size={16} strokeWidth={1.5} />
          Smart move. Reducing your position size is a sign of discipline, not weakness.
        </div>
      )}
    </div>
  );
}
