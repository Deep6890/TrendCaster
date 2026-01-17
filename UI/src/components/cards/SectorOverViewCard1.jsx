import React from 'react';
import { ArrowUpRight, BarChart3, PieChart, Activity } from 'lucide-react';
import MetricRow from './MetricRow';

export default function SectorOverViewCard1() {
    return (
        /* Constraints: 60% width, No shadows, No background blurs, exact same styling */
        <div className="relative overflow-hidden w-full min-w-[360px] bg-white border border-gray-500 p-5 rounded-3xl">

            {/* Top Section: Header & Trend (Exact same as your design) */}
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">IT Sector</h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Technology & Software</p>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={16} strokeWidth={3} />
                        <span className="text-sm font-bold">+2.5%</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase mt-1 tracking-widest">Bullish</span>
                </div>
            </div>

            {/* Metrics Stack: Three Grid/List Items */}
            <div className="space-y-3">
                <MetricRow
                    icon={<Activity size={18} className="text-slate-400" />}
                    label="Market Volume"
                    value="₹2,450"
                    unit="cr"
                    progress={70}
                />
                <MetricRow
                    icon={<PieChart size={18} className="text-slate-400" />}
                    label="Market Cap"
                    value="₹18.5"
                    unit="Lakh cr"
                    progress={40}
                />
                <MetricRow
                    icon={<BarChart3 size={18} className="text-slate-400" />}
                    label="Volatility"
                    value="18"
                    unit="%"
                    progress={25}
                />
            </div>
        </div>
    );
}