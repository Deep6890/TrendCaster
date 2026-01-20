import React from 'react'
import HorizontalBars from '../charts/HorizontalBars'

export default function ChartsBase(props) {
    return (
        <>
            <div className='flex flex-col w-[90%] h-auto p-5'>
                <div className='flex flex-row w-full text-2xl font-semibold'>
                    {props.header}
                </div>
                <div className='flex flex-row w-full text-[0.7rem] font-semibold text-gray-500'>
                    {props.subheader}
                </div>
                <div className='flex flex-row w-full h-auto'>
                    <HorizontalBars />
                </div>
            </div>
        </>
    )
}
