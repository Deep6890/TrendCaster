import React from 'react'
import Card from '../cards/Card'
import Container from '../layout/Container'

function BentoForTredNews() {
    return (
        <>
            <div className='w-full flex-row h-auto bg-gray-100'>
                <div className='flex flex-col w-1/2 p-2 justify-center items-center'>
                    <div className='flex w-full h-auto justify-between flex-wrap items-center '>
                        <Card variant='bento' Header="Today's USD->INR"></Card>
                        <Card variant='bento'></Card>
                    </div>
                    <Container variant='bento' className='mt-2 justify-between flex flex-col justify-between'>
                        <div className='flex w-full my-1 h-auto'>
                            <h1>HIi</h1>
                        </div>
                        <div className='flex w-full my-1'>
                            <Card variant='bento' width='w-80' className='mx-2' ></Card>
                            <Card variant='bento' className='mx-2' ></Card>
                        </div>
                        <div className='flex w-full my-1'>
                            <Card variant='bento' width='w-80' className='mx-2' ></Card>
                            <Card variant='bento' className='mx-2' ></Card>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default BentoForTredNews