import React, { Fragment, useState } from 'react'

import { Splide, SplideSlide } from '@splidejs/react-splide'

import '@splidejs/react-splide/css'

const Thumbnails = ({ dataArray }) => {
    const [isOpen, setIsOpen] = useState(true)

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }
    return (
        <>
            {dataArray.map((item, index) => (
                <img
                    key={item?.id}
                    title={index}
                    src={item?.url}
                    alt={item?.name}
                    loading="lazy"
                    width={170}
                    className="h-[168px] w-[168px] rounded object-cover"
                />
            ))}

            <div className="fixed inset-0 z-[9999] flex items-center bg-black/35">
                <Splide aria-label="file attachments">
                    {dataArray.map((item, index) => (
                        <SplideSlide
                            key={item?.id}
                            className="flex h-[calc(100dvh_-_100px)] items-center"
                        >
                            <img
                                src={item?.url}
                                className="h-auto max-h-[calc(100dvh_-_100px)] w-full object-contain"
                                alt="Image 1"
                            />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>

            {/* <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[9999]"
                    onClose={closeModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="rounded-2x w-full max-w-screen-xl transform overflow-hidden text-left align-middle transition-all"></Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}
        </>
    )
}

export default Thumbnails
