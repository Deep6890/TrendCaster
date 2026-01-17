import React from 'react'
import MarketOverviewCard from '../cards/MarketOverviewCard'

export default function MarketTermsSection() {
    return (
        <>
            <div className='flex w-[90%] h-auto p-5 flex flex-col'>
                <div className='text-3xl font-semibold text-black my-2'>
                    Market Overview
                </div>
                <div className='text-[0.8rem] font-medium text-gray-500 my-1'>
                    Real Time insights into market helth and sector performance
                </div>
                <div className='flex flex-row item-center w-full h-auto gap-2'>
                    <MarketOverviewCard text="Market Stress" footerLine="Low Stress - Helthy market" class="border-blue-400 bg-blue-50">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                                32
                            </span>
                            <span className="text-sm font-medium text-gray-400">
                                /100
                            </span>
                        </div>
                    </MarketOverviewCard>
                    <MarketOverviewCard text="Market Stress" footerLine="Low Stress - Helthy market" class="border-blue-400 bg-blue-50">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                                32
                            </span>
                            <span className="text-sm font-medium text-gray-400">
                                /100
                            </span>
                        </div>
                    </MarketOverviewCard>
                    <MarketOverviewCard text="Market Stress" footerLine="Low Stress - Helthy market" class="border-blue-400 bg-blue-50">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                                32
                            </span>
                            <span className="text-sm font-medium text-gray-400">
                                /100
                            </span>
                        </div>
                    </MarketOverviewCard>
                </div>
            </div>
        </>
    )
}
