import React from 'react'

const Loader = () => {
    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-black/40 text-white">
            <div className="">
                <img
                    src="/shop-helper-logo.png"
                    alt="Shop Helper"
                    loading="eager"
                    width={120}
                    className="animate-bounce"
                />
                <p className="animate-pulse text-center text-lg font-medium">
                    Loading...
                </p>
            </div>
        </div>
    )
}

export default Loader
