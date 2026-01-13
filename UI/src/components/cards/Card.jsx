import React, { Children } from 'react'
import DefaultIcon from '../../assets/icons/civil.svg'
import ActivityIndicator from '../ActivityIndicator'
import { TrendingUp, MoveRight } from 'lucide-react'

function Card({
    variant = 'bento',
    width = 'w-50',
    height = 'h-50',
    className = '',
    text = 'Agriculture',
    growthText = 'Rising with momentum',
    growthStatement = 'Government spending increased',
    isPositive = true,
    showExploreButton = false,
    Children,
    Header = "Hii",
    headerClassName = 'flex w-full items-start text-xl font-semibold',
    childClassName = "w-full"
}) {
    if (variant === 'bento') {
        return (
            <div className={`flex ${width} ${height} border-1 flex flex-col p-2 border-black rounded-2xl ${className}`}>
                <div className={headerClassName}>
                    {Header}
                </div>
                <div className={childClassName}>
                    {Children}
                </div>
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col items-center justify-between border border-green-800 p-4 rounded-2xl bg-green-50 ${className}`}
            style={{ width: width, height: height }}
        >
            <div className='flex w-full items-start justify-between'>
                <img src={DefaultIcon} alt={`${text} icon`} className="w-12 h-12 rounded-full p-1 object-contain" />
                <ActivityIndicator />
            </div>
            <div className='text-black text-xl font-semibold w-full ml-3 items-center flex'>{text}</div>
            <div className='text-black text-[13px] font-normal w-full ml-3 items-center flex'>{growthStatement}</div>
            <div className='w-full justify-between flex flex-col h-auto'>
                <div className='min-w-[100px] w-auto items-center flex h-[35px] rounded-lg text-xs pl-1 text-center'>
                    <h6 className={`font-medium ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{growthText}</h6>
                </div>
            </div>
            <div className='text-black text-[10px] font-normal w-full ml-3 items-center flex'>
                Strong <span className='flex justify-center items-center ml-0.5'><TrendingUp color="#50c367" width="15px" /></span>
            </div>
            {showExploreButton && (
                <div className='flex justify-center w-full items-center m-1 border-1 p-1 rounded-xl bg-emerald-100 font-medium'>
                    Explore More <span className='justify-center items-center ml-2'><MoveRight color="#50c367" width="20px" /></span>
                </div>
            )}
        </div>
    )
}

export default Card