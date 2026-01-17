import React from 'react'
import SectorOverViewCard1 from '../cards/SectorOverViewCard1'
import SectorOverViewCard2 from '../cards/SectorOverViewCard2'
import { TrendingSectors } from './TrendingSectors'
import AiCard from '../cards/AiCard'
import { Grid } from 'lucide-react'
export default function SectorsPerformenceHub() {
    return (
        <>
            <div className='flex w-[90%] h-auto p-5 flex flex-col gap-3'>
                <div className='text-3xl font-semibold text-black'>
                    Sector Performence Hub
                </div>
                <div className='text-[0.8rem] font-medium text-gray-500 my-1'>
                    Track how diffrent sectors are performing with visual insights
                </div>
                <div className='flex flex-row item-center w-full h-auto gap-2 justify-between'>
                    <div className='flex item-center w-[60%]'>
                        <SectorOverViewCard1></SectorOverViewCard1>
                    </div>
                    <div className='flex item-center w-[30%]'>
                        <SectorOverViewCard2></SectorOverViewCard2>
                    </div>
                    <div className='flex item-center w-[30%]'>
                        <AiCard />
                    </div>
                </div>
                <div className='flex flex-row item-center w-full h-auto gap-2'>
                    <TrendingSectors />
                </div>
                <div className='flex flex-row item-center w-full h-auto gap-2'>
                    <Grid />
                </div>
            </div>
        </>
    )
}
