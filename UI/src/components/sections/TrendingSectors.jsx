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
            <div className='w-full mb-4 px-4 py-3 border-gray-600'>
                <h2 className='font-semibold text-3xl text-gray-800'>
                    Overview of all the sections
                </h2>
            </div>
            <div className='flex overflow-x-auto gap-6 p-2 w-full no-scrollbar'>
                {cardData.map((item) => {
                    return (
                        <div key={item.id} className="flex-shrink-0">
                            <Card
                                text="Pharma"
                                growthText="Not in very good position"
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