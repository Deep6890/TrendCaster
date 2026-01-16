import React from 'react'
import BasicLineChart from "../charts/BasicLineChart"
export default function ChartCard(props) {
    const finalHead = props.head || "IT Data preview"
    const chartTrendNews = props.newsHead || "It Trend Statastics"
    const compData = props.dataset || []
    return (
        <>

            <div className='flex justify-between items-center flex-col border-1 border-black rounded-2xl w-[90%] h-auto p-5 m-5'>
                <div className='flex justify-between items-center flex-row w-full h-auto'>
                    <h1 className='font-semibold text-2xl text-orange-400'>
                        {finalHead}
                    </h1>
                </div>
                <div className='flex justify-between items-start flex-row w-full h-auto mt-7'>
                    <div className='flex justify-center items-center flex-col w-[60%]'>
                        <div className='flex w-full h-auto'>
                            <BasicLineChart dataset={compData} />
                        </div>
                    </div>
                    <div className='flex justify-center items-center flex-col w-[35%]'>
                        <div className='flex items-center flex-row w-full h-auto p-2'>
                            <h2 className='font-semibold'></h2>
                        </div>
                        <div className='flex justify-around items-center flex-col w-full overflow-y-auto h-auto no-scrollbar'>
                            <div className='flex justify-center items-center bg-amber-100 h-12 border-1 border-black rounded-xl w-full m-1'>
                                {chartTrendNews}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
