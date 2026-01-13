import React from 'react'

function Container({
    variant = 'bento',
    className = '',
    children
}) {
    if (variant === 'bento') {
        return (
            <div className={`flex h-auto border-1 justify-center items-center border-black rounded-2xl p-2 ${className}`}>
                {children}
            </div>
        )
    }

    if (variant === 'section') {
        return (
            <div className={`w-full mx-auto flex justify-center flex-col border-black border-1 p-10 m-5 rounded-xl ${className}`}>
                {children}
            </div>
        )
    }

    return (
        <div className={`flex flex-col w-full h-auto border rounded-2xl overflow-hidden p-5 ${className}`}>
            {children}
        </div>
    )
}

export default Container