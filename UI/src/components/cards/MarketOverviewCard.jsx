import React, { Children } from 'react'
import DefaultIcon from '../../assets/icons/civil.svg'
export default function MarketOverviewCard(props) {
    return (
        <>
            <div className={`flex flex-col w-60 h-auto justify-around border-1 m-5 p-3 rounded-2xl gap-1 ${props.class}`}>
                <div className='flex flex-row w-full items-center text-sm font-semibold'>
                    <img src={DefaultIcon} alt={`icon`} className="w-14 h-14 rounded-full p-1 object-contain" />
                </div>
                <div className='flex flex-row w-full items-center text-[0.9rem] font-semibold text-gray-500 mt-3 ml-1'>
                    {props.text || "Lodding...."}
                </div>
                <div className="flex items-baseline gap-1 ml-1">
                    {props.children}
                </div>

                <div className='flex flex-row w-full items-center  text-[0.8rem] text-green-700 font-semibold ml-1'>
                    {props.footerLine}
                </div>
            </div>
        </>
    )
}
