import React from 'react'
import DefaultIcon from '../../assets/icons/civil.svg'
import ActivityIndicator from '../ActivityIndicator'
import { TrendingUp, MoveRight } from 'lucide-react'

export default function Card({
    width = 'w-50',
    height = 'h-50',
    className = '',
    text = '',
    growthText = '',
    growthStatement = '',
    isPositive = true,
    showExploreButton = false,
    children,
    header,
    footer,
    icon = DefaultIcon,
    showActivity = true
}) {
    return (
        <div
            className={`flex flex-col items-center justify-between border border-green-800 p-4 rounded-2xl bg-green-50 ${className}`}
            style={{ width: width, height: height }}
        >
            {/* Header Section */}
            <div className='flex w-full items-start justify-between'>
                {header ? header : (
                    <>
                        <img src={icon} alt={`${text} icon`} className="w-12 h-12 rounded-full p-1 object-contain" />
                        {showActivity && <ActivityIndicator />}
                    </>
                )}
            </div>

            {/* Main Content Section */}
            <div className='w-full flex flex-col gap-1 flex-1 justify-center'>
                {children ? children : (
                    <>
                        <div className='text-black text-xl font-semibold ml-3 items-center flex'>{text}</div>
                        <div className='text-black text-[13px] font-normal ml-3 items-center flex'>{growthStatement}</div>
                        <div className='min-w-[100px] w-auto items-center flex h-[35px] rounded-lg text-xs pl-1 ml-2'>
                            <h6 className={`font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{growthText}</h6>
                        </div>
                        <div className='text-black text-[10px] font-normal ml-3 items-center flex'>
                            Bullish Strong <span className='flex justify-center items-center ml-0.5'><TrendingUp color="#50c367" width="15px" /></span>
                        </div>
                    </>
                )}
            </div>

            {/* Footer / Explore Section */}
            {showExploreButton && (
                <div className='flex justify-center w-full items-center m-1 border-1 p-1 rounded-xl bg-emerald-100 font-medium cursor-pointer'>
                    {footer ? footer : (
                        <>
                            Explore More <span className='justify-center items-center ml-2'><MoveRight color="#50c367" width="20px" /></span>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}