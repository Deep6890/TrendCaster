import React from 'react'
import Card from '../cards/Card'
import Container from '../layout/Container'

export const TrendingSectors = () => {
    const cardData = [
        { id: 1, icon: null }, { id: 2, icon: null }, { id: 3, icon: null },
        { id: 4, icon: null }, { id: 5, icon: null }, { id: 6, icon: null },
        { id: 7, icon: null }, { id: 8, icon: null },
    ];

    return (
        <Container variant='section'>
            <div className='w-full mb-6 px-4 py-3 bg-gradient-to-r from-emerald-100 to-emerald-50 border-l-4 border-gray-600 rounded-r-lg'>
                <h2 className='font-semibold text-xl text-gray-800'>
                    Price Rising Sectors
                </h2>
            </div>
            <div className='flex overflow-x-auto gap-6 p-4 w-full no-scrollbar'>
                {cardData.map((item) => {
                    return (
                        <div key={item.id} className="flex-shrink-0">
                            <Card
                                variant='thumbnail'
                                width='220px'
                                height='260px'
                                showExploreButton={true}
                            />
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}