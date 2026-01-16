import React from 'react'
import Card from '../cards/Card'
import Container from '../layout/Container'
import { ArrowRight } from 'lucide-react'

function BentoForTredNews() {
    return (
        <>
            <div className='w-full flex-row h-auto bg-gray-100'>
                <div className='flex flex-col w-1/2 p-2 justify-center items-center'>
                    <div className='flex w-full h-auto justify-between flex-wrap items-center '>
                        <Card
                            variant='bento'
                            className="bg-white"
                            Header={
                                <div className="inline-flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                    <span className="text-green-700 text-xs font-bold">▲ +0.45%</span>
                                </div>
                            }
                            headerClassName="flex justify-start w-full"
                            Children={
                                <div className="w-full h-[78px] flex items-center justify-center">
                                    <div className="w-full h-full bg-gradient-to-t from-green-50/50 to-transparent border-b border-green-500/20 dashed" />
                                </div>
                            }
                            childClassName="w-full py-4"
                            footer={
                                <div className="flex items-end justify-between w-full">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-bold text-black flex items-center gap-2">
                                            USD
                                            <span><ArrowRight color="#50c367" width="15px" /></span>
                                            INR
                                        </h2>
                                        <span className="text-gray-500 text-[10px] font-medium">
                                            Global Exchange
                                        </span>
                                    </div>
                                </div>
                            }
                            footerClass="w-full"
                        />
                        <Card
                            variant="bento"
                            className="bg-white"

                            Header={
                                <div className="flex w-full flex-row items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
                                        🇮🇳
                                    </div>
                                    <span className="text-base font-bold text-gray-900">India</span>
                                </div>
                            }
                            headerClassName="flex justify-start w-full"

                            Children={
                                <div className="flex h-[78px] w-full items-center justify-start">
                                    <p className="text-sm font-normal leading-snug text-gray-500">
                                        Economically, India has been the most stable.
                                    </p>
                                </div>
                            }
                            childClassName="w-full py-4"

                            footer={
                                <div className="flex w-full justify-center">
                                    <h2 className="text-sm font-bold uppercase text-purple-600">
                                        Top stable country
                                    </h2>
                                </div>
                            }
                            footerClass="w-full"
                        />
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