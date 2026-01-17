import React from 'react'
import Button from '../buttons/Button'
import LOGO from '../../assets/logo.png'

function Navbar() {
    return (
        <>
            <nav className='flex w-full h-20 flex-col justify-center items-center flex-wrap border-b border-gray-700'>
                <div className='flex w-full flex-row justify-between flex-wrap items-center'>
                    <div className='flex w-5/6 justify-evenly flex-wrap'>
                        <div className='flex justify-center w-1/5 object-cover'>
                            <img src={LOGO} alt="Company Logo" />
                        </div>
                        <div className='flex justify-around p-2 items-center flex-row w-4/7 mr-5 text-black font-medium'>
                            <div className='flex justify-center items-center'>
                                <p>Overview</p>
                            </div>
                            <div className='flex justify-center items-center'>
                                Sectors
                            </div>
                            <div className='flex justify-center items-center'>
                                Market Helth
                            </div>
                            <div className='flex justify-center items-center'>
                                Predictions
                            </div>
                            <div className='flex justify-center items-center'>
                                Insights
                            </div>
                        </div>
                    </div>
                    <div className='flex w-1/6 items-center justify-center flex-wrap'>
                        <Button width='70%' height='50px' textSize='16px' />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar