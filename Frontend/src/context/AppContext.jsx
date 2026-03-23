import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

/* ── Simulated market data ─────────────────────────────────── */
const MARKET_DATA = {
  nifty: { value: 22187.40, change: -0.43, trend: 'down' },
  sensex: { value: 73264.50, change: -0.38, trend: 'down' },
  vix: { value: 14.82, change: 0.12, trend: 'up', level: 'calm' },
  gold: { value: 72300, change: 0.62, trend: 'up' },
  crude: { value: 6310, change: -1.14, trend: 'down' },
  usd_inr: { value: 83.52, change: 0.08, trend: 'up' },
};

const SECTORS = [
  { name: 'Banking', score: 1.34, trend: 'up',   rank: 1, sentiment: 'Smart accumulation' },
  { name: 'IT',      score: 1.12, trend: 'up',   rank: 2, sentiment: 'Calm entry' },
  { name: 'Pharma',  score: 0.98, trend: 'flat', rank: 3, sentiment: 'Wait zone' },
  { name: 'Energy',  score: 0.72, trend: 'down', rank: 4, sentiment: 'Retail panic' },
  { name: 'Metal',   score: 0.61, trend: 'down', rank: 5, sentiment: 'FOMO exit' },
  { name: 'FMCG',    score: 0.55, trend: 'flat', rank: 6, sentiment: 'Wait zone' },
  { name: 'Realty',  score: 0.43, trend: 'down', rank: 7, sentiment: 'Risky chase' },
  { name: 'Auto',    score: 0.38, trend: 'flat', rank: 8, sentiment: 'Wait zone' },
];

/* ── Mistake history (simulated) ───────────────────────────── */
const MISTAKE_HISTORY = [
  { date: '2024-12-10', action: 'Bought Realty at peak', outcome: '-8.2%' },
  { date: '2025-01-15', action: 'Panic sold IT during dip', outcome: 'Missed +12%' },
  { date: '2025-02-03', action: 'Chased Energy trend late', outcome: '-5.4%' },
];

/* ── Daily feed ─────────────────────────────────────────────── */
const DAILY_FEED = [
  "Market calm hai. Aaj unnecessary trade avoid karo. 🧘",
  "Banking sector strong lag raha hai. Accumulation zone me hai.",
  "VIX low hai — this is usually a good time for small entries.",
  "Crude oil fall ho raha hai. Energy sector ko avoid karo abhi.",
  "IT sector me smart money wapas aa raha hai.",
];

export function AppProvider({ children }) {
  /* ── Guardian AI state ──────────────── */
  const [income, setIncome] = useState(50000);
  const [riskLevel, setRiskLevel] = useState(2); // 1=scared 2=normal 3=chill 4=aggressive
  const [autopilotOn, setAutopilotOn] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [guardianDecision, setGuardianDecision] = useState(null);
  const [frictionActive, setFrictionActive] = useState(false);
  const [frictionQuestion, setFrictionQuestion] = useState('');

  /* ── Regret simulator ───────────────── */
  const [regretAsset, setRegretAsset] = useState('');
  const [regretAmount, setRegretAmount] = useState('');
  const [regretFutures, setRegretFutures] = useState(null);

  /* ── Chat state ─────────────────────── */
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: "Hey! I'm TrendCaster — your market buddy! 👋 Ask me anything about the market — which sector is hot, should you buy gold, or what's going on with Nifty right now!",
      ts: new Date(),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [confusionCount, setConfusionCount] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');

  /* ── Active page ─────────────────────── */
  const [activePage, setActivePage] = useState('dashboard');

  /* ── Wait meter ──────────────────────── */
  const [waitDays, setWaitDays] = useState(3);

  /* ── Life impact calc ────────────────── */
  const [lifeAmount, setLifeAmount] = useState('5000');

  /* ── Guardian evaluator ──────────────── */
  const evaluateGuardian = useCallback((asset, amount) => {
    const amt = parseFloat(amount) || 0;
    const maxSafe = income * 0.1; // max 10% of monthly income
    const riskMultipliers = [0, 0.05, 0.10, 0.20, 0.30]; // scared → aggressive

    const allowedPct = riskMultipliers[riskLevel] || 0.10;
    const allowed = income * allowedPct;

    // Find sector data
    const sectorData = SECTORS.find(s => s.name.toLowerCase().includes(asset.toLowerCase()));
    const entryType = sectorData?.sentiment || 'Unknown zone';
    const isRisky = ['Retail panic', 'FOMO exit', 'Risky chase'].includes(entryType);

    // Friction trigger
    if (amt > allowed && autopilotOn) {
      setFrictionActive(true);
      setFrictionQuestion(
        amt > allowed * 2
          ? 'You are about to invest more than double what is safe for you. Are you doing this because prices are going up fast?'
          : 'This amount is above your safe limit. Are you feeling FOMO right now?'
      );
    }

    // Similar past mistake check
    const pastMistake = MISTAKE_HISTORY.find(m =>
      m.action.toLowerCase().includes(asset.toLowerCase()) ||
      (isRisky && m.action.includes('peak'))
    );

    const decision = {
      allowed: Math.min(allowed, amt),
      requested: amt,
      safeAmount: Math.round(allowed),
      entryType,
      isRisky,
      pastMistake: pastMistake || null,
      guardianBlocked: autopilotOn && amt > allowed * 1.5,
      message: amt <= allowed
        ? `✅ This is a safe entry. ${entryType} detected.`
        : autopilotOn
        ? `🚫 I won't allow full amount. You can invest ₹${Math.round(allowed).toLocaleString('en-IN')} safely, not ₹${amt.toLocaleString('en-IN')}.`
        : `⚠️ Amount is above your comfort zone. Consider ₹${Math.round(allowed).toLocaleString('en-IN')}.`,
    };

    setGuardianDecision(decision);
    return decision;
  }, [income, riskLevel, autopilotOn]);

  /* ── Regret simulator ────────────────── */
  const simulateRegret = useCallback((asset, amount) => {
    const amt = parseFloat(amount) || 5000;
    const sectorData = SECTORS.find(s => s.name.toLowerCase().includes((asset || '').toLowerCase()));
    const trend = sectorData?.trend || 'flat';

    const scenarios = {
      best: {
        label: '📈 Best Case',
        pct: trend === 'up' ? '+18%' : '+8%',
        value: `₹${Math.round(amt * (trend === 'up' ? 1.18 : 1.08)).toLocaleString('en-IN')}`,
        note: 'Rare — happens when macro supports it',
        color: 'success',
      },
      worst: {
        label: '📉 Worst Case',
        pct: trend === 'down' ? '-22%' : '-12%',
        value: `₹${Math.round(amt * (trend === 'down' ? 0.78 : 0.88)).toLocaleString('en-IN')}`,
        note: 'Possible if sector reverses sharply',
        color: 'danger',
      },
      likely: {
        label: '➖ Most Likely',
        pct: trend === 'flat' ? '+2%' : trend === 'up' ? '+7%' : '-5%',
        value: `₹${Math.round(amt * (trend === 'flat' ? 1.02 : trend === 'up' ? 1.07 : 0.95)).toLocaleString('en-IN')}`,
        note: trend === 'down' ? 'Most beginners regret entering at this stage.' : 'Expect slow movement for 2–4 weeks.',
        color: 'warn',
      },
    };

    setRegretFutures(scenarios);
    return scenarios;
  }, []);

  /* ── Chat send ───────────────────────── */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const CONFUSION_TRIGGERS = ['buy?', 'still buy', 'now?', 'should i', 'abhi?', 'kya karu'];
    const isConfused = CONFUSION_TRIGGERS.some(t => text.toLowerCase().includes(t));
    
    if (isConfused && text.toLowerCase() === lastQuestion.toLowerCase()) {
      setConfusionCount(c => c + 1);
    } else {
      setConfusionCount(0);
    }
    setLastQuestion(text);

    const newMsg = { id: Date.now(), role: 'user', text, ts: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setChatLoading(true);

    // Confusion intercept
    if (confusionCount >= 2) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          text: "🧠 You seem unsure — asking me the same thing multiple times. That's your gut telling you to wait. Better to wait than force a decision you'll regret. Come back tomorrow with a clearer head. 💪",
          ts: new Date(),
          type: 'confusion-alert',
        }]);
        setChatLoading(false);
        setConfusionCount(0);
      }, 800);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      let aiText;
      if (res.ok) {
        const data = await res.json();
        aiText = data.answer;
      } else {
        aiText = generateLocalResponse(text);
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText, ts: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: generateLocalResponse(text),
        ts: new Date(),
      }]);
    } finally {
      setChatLoading(false);
    }
  }, [confusionCount, lastQuestion]);

  return (
    <AppContext.Provider value={{
      marketData: MARKET_DATA,
      sectors: SECTORS,
      mistakeHistory: MISTAKE_HISTORY,
      dailyFeed: DAILY_FEED,
      income, setIncome,
      riskLevel, setRiskLevel,
      autopilotOn, setAutopilotOn,
      investmentAmount, setInvestmentAmount,
      selectedAsset, setSelectedAsset,
      guardianDecision, setGuardianDecision,
      frictionActive, setFrictionActive,
      frictionQuestion,
      evaluateGuardian,
      regretAsset, setRegretAsset,
      regretAmount, setRegretAmount,
      regretFutures, setRegretFutures,
      simulateRegret,
      messages, sendMessage, chatLoading,
      confusionCount,
      activePage, setActivePage,
      waitDays, setWaitDays,
      lifeAmount, setLifeAmount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

/* ── Local fallback responses ───────────────────────────────── */
function generateLocalResponse(text) {
  const q = text.toLowerCase();

  if (q.includes('banking') || q.includes('bank'))
    return "What's happening:\nBanking sector rank#1 with score 1.34 — strongest sector right now 💪\n\nWhy it's happening:\nRBI policy stable, credit growth picking up, smart money accumulating.\n\nWhat you can do:\nSmall SIP-style entry is safe. Don't put everything at once.";

  if (q.includes('crude') || q.includes('oil'))
    return "What's happening:\nCrude oil is falling (-1.14% today). Energy sector rank#4 with retail panic.\n\nWhy it's happening:\nGlobal demand concerns + US inventory build-up pushing prices down.\n\nWhat you can do:\nAvoid buying energy stocks right now. Wait for a reversal signal.";

  if (q.includes('gold'))
    return "What's happening:\nGold up +0.62% today at ₹72,300. Classic safe haven demand.\n\nWhy it's happening:\nMarkets uncertain → people move to gold. Classic pattern.\n\nWhat you can do:\nSmall gold allocation (5-10%) is fine as hedge. Don't go all-in.";

  if (q.includes('nifty') || q.includes('sensex') || q.includes('market'))
    return "What's happening:\nNifty at 22,187 (down 0.43%). VIX at 14.82 — market is relatively calm despite the dip.\n\nWhy it's happening:\nGlobal cues weak but India macro is holding up okay.\n\nWhat you can do:\nDon't panic sell. VIX is low = not a crash signal. Watch Banking for strength.";

  if (q.includes('buy') || q.includes('invest') || q.includes('karu'))
    return "If I had your money, I would wait 2–3 days. The market dipped today but hasn't figured out direction yet. Entry now = slightly risky. Entry after clarity = smarter. Your money, your call — but patience is free.";

  if (q.includes('vix'))
    return "VIX at 14.82 = market is calm 😌. When VIX is below 15, people aren't panicking. This usually means prices are stable. Good time to make calm, planned decisions — not rushed ones.";

  return "I'm TrendCaster, your market buddy! I look at real market data and explain things simply. Ask me about gold, Nifty, crude oil, banking, or any sector — I'll tell you what's really going on. 🎯";
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
