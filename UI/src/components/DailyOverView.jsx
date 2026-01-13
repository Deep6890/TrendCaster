import React from 'react'
import Container from './layout/Container'

function DailyOverView() {
    const data = [
        { "id": 1, "date": "2024-03-15", "time": "09:30 AM", "news": "Agriculture demand spikes globally" },
        { "id": 2, "date": "2024-03-15", "time": "10:15 AM", "news": "Green energy subsidies announced" },
        { "id": 3, "date": "2024-03-15", "time": "11:45 AM", "news": "Tech sector volatility increases" },
        { "id": 4, "date": "2024-03-15", "time": "01:20 PM", "news": "Steel exports hit record high" },
        { "id": 5, "date": "2024-03-15", "time": "02:55 PM", "news": "Inflation remains stable today" }
    ];

    return (
        <Container>
            <div className='flex flex-col m-0 w-[90%] justify-center items-center'>
                <div className='flex items-center w-full text-black font-semibold text-xl py-2 px-3 border-b border-gray-700'>
                    Daily Trends
                </div>
                <div className='flex flex-col w-full mt-2'>
                    {data.map((item) => (
                        <div key={item.id} className='flex flex-row items-center py-3 transition-colors bg-gray-200 mx-1.5 my-0.5 rounded-2xl'>
                            <div className='flex flex-col w-1/3 text-center'>
                                <span className='text-xs font-semibold text-gray-500'>{item.date}</span>
                                <span className='text-sm font-bold text-gray-600'>{item.time}</span>
                            </div>
                            <div className='w-2/3 px-4 text-sm font-medium text-gray-800'>
                                {item.news}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default DailyOverView;