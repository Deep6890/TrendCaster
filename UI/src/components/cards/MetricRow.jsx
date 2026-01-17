import React from 'react';

export default function MetricRow({ icon, label, value, unit, progress }) {
    return (
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-transparent">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{label}</p>
                    <p className="text-lg font-bold text-slate-800">
                        {value}<span className="text-sm ml-0.5 text-slate-500 font-medium">{unit}</span>
                    </p>
                </div>
            </div>

            {/* Exact Progress Bar Style from your snippet */}
            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}