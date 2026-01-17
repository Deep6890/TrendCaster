import React from 'react';
import AILOGO from '../../assets/AiSun.png';
import { Cpu, Activity, ChevronRight, Send, ArrowRight } from 'lucide-react';

export default function AiCard() {
    return (
        /* The Window Shell: 60% width, no shadows, clean borders */
        <div className="w-[60%] min-w-[380px] border-2 border-slate-100 rounded-[2.5rem] bg-white overflow-hidden font-sans">

            {/* 1. Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Neural.Terminal.v2
                    </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase">Online</span>
                </div>
            </div>

            {/* 2. Content Area */}
            <div className="p-8 pb-4">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-slate-100 rounded-2xl p-2.5 flex items-center justify-center relative z-10 bg-white">
                            <img src={AILOGO} alt="AI Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 w-16 h-16 border-2 border-indigo-100 rounded-2xl -z-0" />
                    </div>

                    <div className="flex-1 space-y-1">
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter">
                            SUN <span className="text-indigo-600">INTEL</span>
                        </h2>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                            How can I help you analyze the market today?
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Terminal Style Input Box */}
            <div className="px-8 pb-8">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
                        <ChevronRight size={18} strokeWidth={3} />
                    </div>

                    <input
                        type="text"
                        placeholder="Ask AI a question..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-14 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-200 focus:bg-white transition-all"
                    />

                    {/* "Go" Button Integrated in Input */}
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-none">
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Optional Action Suggestions */}
                <div className="flex gap-2 mt-4">
                    {['Analyze IT', 'Check Volatility'].map((tag) => (
                        <button key={tag} className="text-[9px] font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-full hover:bg-slate-50 transition-colors">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}