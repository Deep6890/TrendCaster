import React from 'react';
import { CircleDollarSign, MoveUp } from 'lucide-react';

export default function SectorOverViewCard2() {
    return (
        <div className="w-[60%] min-w-[340px] border border-slate-500 p-6 rounded-[2.5rem] bg-white">
            {/* 1. Icon Header */}
            <div className="mb-6">
                <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl">
                    <CircleDollarSign className="text-indigo-600" size={24} />
                </div>
            </div>

            {/* 2. Sector Titles */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">Banking</h3>
                <p className="text-sm font-medium text-slate-400">Financial Services</p>
            </div>

            {/* 3. Percentage Highlight */}
            <div className="mb-4">
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                    +2.8%
                </span>
            </div>

            {/* 4. Bullish Badge */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                    <MoveUp size={14} strokeWidth={3} />
                    <span className="text-xs font-bold uppercase tracking-wide">Bullish</span>
                </div>
            </div>

            {/* 5. Bottom Divider and Metrics */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-500">15% Volatility</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-slate-800 tracking-tight">₹12.8L Cr</span>
                </div>
            </div>
        </div>
    );
}