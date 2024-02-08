import React, { Fragment } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { Splide, SplideSlide } from '@splidejs/react-splide'

const SliderModal = ({ open, onClose, activeSlide, files = [] }) => {
    return (
        <Fragment>
            <div className="relative z-[9999]">
                <div className="fixed inset-0 bg-black/95" />
                <div className="fixed inset-0 overflow-y-hidden">
                    <div className="flex min-h-[100dvh] items-center justify-center overflow-hidden text-center">
                        <button
                            type="button"
                            className="absolute left-2 top-3 z-[9999] p-3 text-2xl text-white"
                            onClick={onClose}
                        >
                            <FaArrowLeft />
                        </button>
                        <div className="w-full max-w-7xl">
                            <Splide
                                options={{
                                    gap: '1rem',
                                    pagination: false,
                                    start: activeSlide,
                                    snap: true,
                                    height: 'calc(100dvh - 80px)',
                                }}
                                aria-label="attachment files slider"
                            >
                                {files.map((file, index) => (
                                    <SplideSlide key={`slide-${index}`}>
                                        <img
                                            src={file?.url}
                                            data-splide-lazy={file?.url}
                                            alt={file?.name}
                                            loading="lazy"
                                            className="h-full w-full object-contain"
                                        />
                                    </SplideSlide>
                                ))}
                            </Splide>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SliderModal
