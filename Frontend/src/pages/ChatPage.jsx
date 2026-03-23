import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Brain, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUICK_PROMPTS = [
  'Should I buy Banking stocks now?',
  'What is Nifty doing today?',
  'Is gold safe right now?',
  'Should I wait or invest today?',
  'What is the VIX telling us?',
  'Crude oil — buy or avoid?',
];

function Message({ msg }) {
  const isAI = msg.role === 'ai';
  const time  = msg.ts?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`max-w-[85%] ${isAI ? '' : 'flex flex-col items-end'}`}>
        {isAI && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-bold shrink-0">
              TC
            </div>
            <span className="text-[10px] text-white/25">TrendCaster · {time}</span>
          </div>
        )}
        <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isAI
            ? `bubble-ai bg-[#1a1a1a] border text-white/80 ${msg.type === 'confusion-alert' ? 'border-yellow-500/30 bg-yellow-500/[0.08] text-yellow-200' : 'border-white/[0.08]'}`
            : 'bubble-user bg-white text-black font-medium'
        }`}>
          {msg.text}
        </div>
        {!isAI && <p className="text-[10px] text-white/20 mt-1">{time}</p>}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bubble-ai bg-[#1a1a1a] border border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse-soft" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { messages, sendMessage, chatLoading, confusionCount } = useApp();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleSend = () => {
    if (!input.trim() || chatLoading) return;
    sendMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] animate-fade-in">

      {/* Confusion warning */}
      {confusionCount >= 2 && (
        <div className="mx-4 mt-4 flex items-center gap-2.5 bg-yellow-500/[0.08] border border-yellow-500/25 rounded-xl px-4 py-2.5 text-xs text-yellow-300 animate-fade-in">
          <Brain size={14} className="shrink-0" />
          <span>You've asked similar questions multiple times. Your AI detects uncertainty — might be best to wait.</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {chatLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); inputRef.current?.focus(); }}
              className="shrink-0 flex items-center gap-1 text-[11px] text-white/40 border border-white/[0.08] rounded-full px-3 py-1.5 hover:text-white/70 hover:border-white/20 transition-all whitespace-nowrap"
            >
              {p}
              <ChevronRight size={10} />
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-white/[0.06] bg-[#050505]">
        <div className="flex items-end gap-3 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-white/20 transition-all">
          <MessageCircle size={16} className="text-white/20 shrink-0 mb-0.5" />
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask anything about the market… (Enter to send)"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none resize-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatLoading}
            className="shrink-0 w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {chatLoading
              ? <Loader2 size={14} className="animate-spin" />
              : <Send size={13} strokeWidth={2.5} />
            }
          </button>
        </div>
        <p className="text-center text-[10px] text-white/15 mt-2">
          TrendCaster uses real market data. Not financial advice.
        </p>
      </div>
    </div>
  );
}
