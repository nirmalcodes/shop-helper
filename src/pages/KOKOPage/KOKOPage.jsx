import React, { useState } from 'react'
import { NumberInput } from '../../components'
import { images } from '../../utils/constants'
import { FaTag } from 'react-icons/fa6'

const KOKOPage = () => {
    const [formData, setFormData] = useState({
        productPrice: '',
        deliveryPrice: '',
        discount: '',
    })

    const handleCalculation = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div className="container">
                <div className="flex w-full flex-col flex-wrap gap-y-4 md:flex-row">
                    <div className="w-full px-2 md:w-[55%] lg:w-[50%]">
                        <form className="w-full rounded-lg bg-white p-4 shadow-md">
                            {/* Logo and Calc Status */}
                            <div className="mb-5 flex items-center">
                                <img
                                    src={images.kokoLogo}
                                    alt="KOKO Logo"
                                    loading="lazy"
                                    width={128}
                                />
                                <div className="ml-auto flex flex-col items-center leading-none text-red-600/90">
                                    <FaTag className="text-[2rem]" />
                                    <p className="font-medium">{'50'}% OFF</p>
                                </div>
                            </div>

                            {/* Inputs & Outputs */}
                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput label="Product Price" required />
                            </div>

                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput label="Delivery Fee" />
                            </div>

                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput label="Convenience Fee" disabled />
                            </div>
                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    label="Total with Convenience Fee"
                                    disabled
                                />
                            </div>
                            <div className="mb-6 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    label="Installment Per Month"
                                    disabled
                                />
                            </div>
                            <button
                                type="submit"
                                className={
                                    'ml-auto flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white  shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700 md:w-[280px]'
                                }
                            >
                                Calculate
                            </button>
                        </form>
                    </div>
                    <div className="w-full md:w-[45%] lg:w-[50%]">
                        <div className="h-full rounded-lg bg-white p-4 shadow-md">
                            Generated Data
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default KOKOPage
