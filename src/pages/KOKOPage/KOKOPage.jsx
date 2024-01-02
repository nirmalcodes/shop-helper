import React, { useState } from 'react'
import { NumberInput } from '../../components'
import { images } from '../../utils/constants'
import { FaTag } from 'react-icons/fa6'

const KOKOPage = () => {
    const [formData, setFormData] = useState({
        productPrice: '',
        deliveryFee: '',
        convenienceFee: '',
        totalWithConvenienceFee: '',
        installmentPerMonth: '',
    })
    const [errors, setErrors] = useState({})

    // Function to update a specific field in the formData state
    const updateFormData = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }))
    }

    // Example of how to use the updateFormData function
    const handleInputChange = (e) => {
        const { name, value } = e.target
        updateFormData(name, value)
    }
    const handleCalculation = (e) => {
        e.preventDefault()

        // Convert all relevant form data values to numbers
        const productPrice = parseFloat(formData.productPrice)
        const deliveryFee = parseFloat(formData.deliveryFee) || 0 // Default to 0 if deliveryFee is not provided

        // Define constants
        const CONVENIENCE_FEE_PERCENTAGE = (100 - 6) / 100

        // Validate product price
        if (isNaN(productPrice)) {
            console.error('Invalid product price')
            return
        }

        // Calculate values
        const priceWithDelivery = productPrice + deliveryFee
        const totalWithConvenienceFee = (
            priceWithDelivery / CONVENIENCE_FEE_PERCENTAGE
        ).toFixed(2)
        const calculatedConvenienceFee = (
            totalWithConvenienceFee - priceWithDelivery
        ).toFixed(2)
        const installmentPerMonth = (totalWithConvenienceFee / 3).toFixed(2)

        // Update formData with the calculated values
        setFormData({
            ...formData,
            totalWithConvenienceFee: parseFloat(totalWithConvenienceFee),
            convenienceFee: parseFloat(calculatedConvenienceFee),
            installmentPerMonth: parseFloat(installmentPerMonth),
        })
    }

    return (
        <>
            <div className="container">
                <div className="flex w-full flex-col flex-wrap gap-y-4 md:flex-row">
                    <div className="w-full px-2 md:w-[55%] lg:w-[50%]">
                        <form
                            onSubmit={handleCalculation}
                            className="w-full rounded-lg bg-white p-4 shadow-md"
                        >
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
                                <NumberInput
                                    id={'productPrice'}
                                    label="Product Price"
                                    value={formData.productPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    id={'deliveryFee'}
                                    label="Delivery Fee"
                                    value={formData.deliveryFee}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    id={'convenienceFee'}
                                    label="Convenience Fee"
                                    value={formData.convenienceFee}
                                    disabled
                                />
                            </div>
                            <div className="mb-3 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    id={'totalWithConvenienceFee'}
                                    label="Total with Convenience Fee"
                                    value={formData.totalWithConvenienceFee}
                                    disabled
                                />
                            </div>
                            <div className="mb-6 flex-wrap items-center md:mb-4 md:flex md:gap-x-4 lg:mb-5">
                                <NumberInput
                                    id={'installmentPerMonth'}
                                    label="Installment Per Month"
                                    value={formData.installmentPerMonth}
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
                    <div className="w-full px-2 md:w-[45%] lg:w-[50%]">
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
