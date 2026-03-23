import { Radio, TrendingUp, TrendingDown, Minus, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WEEKDAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function DailyFeed() {
  const { dailyFeed, marketData, sectors } = useApp();
  const today = new Date();
  const dayName = WEEKDAY[today.getDay()];

  const topSector    = sectors[0];
  const bottomSector = sectors[sectors.length - 1];
  const vix = marketData.vix;

  const mentorFeed = [
    { time: '09:30', text: dailyFeed[0],                                                                                   type: 'calm'    },
    { time: '10:15', text: `${topSector.name} sector rank #1 — score ${topSector.score}. ${topSector.sentiment}.`,        type: 'bullish' },
    { time: '11:00', text: `VIX at ${vix.value} — ${vix.level} market. ${vix.value < 16 ? 'Good for calm decisions.' : 'Be extra careful today.'}`, type: 'info' },
    { time: '12:30', text: `${bottomSector.name} sector weakest right now. Avoid fresh positions.`,                       type: 'bearish' },
    { time: '14:00', text: dailyFeed[2],                                                                                   type: 'calm'    },
    { time: '15:00', text: 'Last hour of trading. Volatility often spikes. Avoid big decisions now.',                     type: 'warn'    },
    { time: '15:30', text: 'Market closing. Review your positions calmly after close, not during.',                       type: 'info'    },
  ];

  const typeConfig = {
    calm:    { DotColor: 'bg-white/30',    textColor: 'text-white/70',    Icon: Minus         },
    bullish: { DotColor: 'bg-emerald-400', textColor: 'text-emerald-300', Icon: TrendingUp    },
    bearish: { DotColor: 'bg-red-400',     textColor: 'text-red-300',     Icon: TrendingDown  },
    info:    { DotColor: 'bg-blue-400',    textColor: 'text-white/60',    Icon: Radio         },
    warn:    { DotColor: 'bg-yellow-400',  textColor: 'text-yellow-300',  Icon: Radio         },
  };

  const weekMoods = [
    { day: 'Mon', emoji: '🧘', mood: 'calm'    },
    { day: 'Tue', emoji: '📈', mood: 'bullish' },
    { day: 'Wed', emoji: '⚠️', mood: 'warn'   },
    { day: 'Thu', emoji: '💪', mood: 'bullish' },
    { day: 'Fri', emoji: '😊', mood: 'calm'    },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
          <Radio size={20} className="text-white/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Daily Intelligence Feed</h2>
          <p className="text-white/40 text-sm mt-0.5">Your mentor's whisper — one sentence at a time</p>
        </div>
      </div>

      {/* Date strip */}
      <div className="flex items-center gap-3">
        <div className="bg-white text-black text-center rounded-xl px-4 py-2">
          <p className="text-[10px] font-bold uppercase">{dayName}</p>
          <p className="text-xl font-bold leading-none">{today.getDate()}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-white/30">Market Intelligence Summary</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Circle size={6} className="fill-emerald-400 text-emerald-400 animate-pulse-soft" />
          <span className="text-xs text-white/30">Live</span>
        </div>
      </div>

      {/* Headline banner */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={12} className="text-white/30" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Today's Headline</p>
        </div>
        <p className="text-sm text-white/80 leading-relaxed font-medium">
          {dailyFeed[today.getDay() % dailyFeed.length]}
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-5">Intraday Whispers</p>
        <div className="space-y-5">
          {mentorFeed.map((item, i) => {
            const cfg = typeConfig[item.type];
            return (
              <div key={i} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${cfg.DotColor}`} />
                  {i < mentorFeed.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-1.5" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] text-white/25">{item.time}</p>
                    <cfg.Icon size={10} className={cfg.DotColor.replace('bg-','text-')} />
                  </div>
                  <p className={`text-sm leading-relaxed ${cfg.textColor}`}>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly mood */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">This Week at a Glance</p>
        <div className="grid grid-cols-5 gap-2">
          {weekMoods.map(({ day, emoji, mood }) => {
            const isCurrent = WEEKDAY[today.getDay()] === day;
            return (
              <div key={day} className={`text-center p-3 rounded-xl border transition-all ${
                isCurrent ? 'bg-white/[0.08] border-white/20' : 'bg-transparent border-white/[0.04]'
              }`}>
                <p className="text-[10px] text-white/30 mb-1">{day}</p>
                <p className="text-lg">{emoji}</p>
                <p className={`text-[10px] mt-1 capitalize ${isCurrent ? 'text-white/70' : 'text-white/25'}`}>{mood}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
