import React from 'react'
import { MoveRight } from 'lucide-react'

function Button({
    variant = 'login',
    width = '100px',
    height = '60px',
    textSize = '20px',
    className = ''
}) {
    if (variant === 'explore') {
        return (
            <div className={`flex justify-center w-full items-center m-1 border-1 p-1 rounded-xl bg-emerald-100 font-medium ${className}`}>
                Explore More <span className='justify-center items-center ml-2'><MoveRight color="#50c367" width="20px" /></span>
            </div>
        )
    }

    return (
        <button
            className={`bg-gray-400 text-xl p-3 items-center flex justify-center rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg font-semibold text-black active:scale-95 ${className}`}
            style={{ width, height, fontSize: textSize }}
        >
            Login / Sign up
        </button>
    )
}

export default Button