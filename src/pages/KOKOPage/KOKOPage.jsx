import React, { useState } from 'react'
import { NumberInput } from '../../components'
import { images } from '../../utils/constants'
import { FaTag } from 'react-icons/fa6'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const KOKOPage = () => {
    const [convenienceFeeRate, setConvenienceFeeRate] = useState(6)
    const [discountMode, setDiscountMode] = useState(false)

    const [formData, setFormData] = useState({
        productPrice: '',
        deliveryFee: '',
        convenienceFee: '',
        totalWithConvenienceFee: '',
        installmentPerMonth: '',
    })
    const [calculatedData, setCalculatedData] = useState({
        productPrice: '',
        deliveryFee: '',
        convenienceFee: '',
        totalWithConvenienceFee: '',
        installmentPerMonth: '',
    })

    const [showCopyBtn, setShowCopyBtn] = useState(false)

    // Function to update a specific field in the formData state
    const updateFormData = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }))
    }

    // Function to handle input field changes
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
        let convenienFeePercentage = (100 - convenienceFeeRate) / 100

        // Validate product price
        if (isNaN(productPrice)) {
            console.error('Invalid product price')
            return
        }

        // Calculate values
        const priceWithDelivery = productPrice + deliveryFee
        const totalWithConvenienceFee = (
            priceWithDelivery / convenienFeePercentage
        ).toFixed(2)
        const calculatedConvenienceFee = (
            totalWithConvenienceFee - priceWithDelivery
        ).toFixed(2)
        const installmentPerMonth = (totalWithConvenienceFee / 3).toFixed(2)

        // Update formData with the calculated values
        setFormData({
            ...formData,
            convenienceFee: parseFloat(calculatedConvenienceFee),
            totalWithConvenienceFee: parseFloat(totalWithConvenienceFee),
            installmentPerMonth: parseFloat(installmentPerMonth),
        })

        // Set clipboard text
        setCalculatedData({
            productPrice,
            deliveryFee,
            convenienceFee: calculatedConvenienceFee,
            totalWithConvenienceFee,
            installmentPerMonth,
        })

        // Set showCopyBtn
        setShowCopyBtn(!showCopyBtn)
    }

    // Function for copy to clipboard (old way)
    const handleCopyToClipboard = () => {
        const deliveryFee = parseFloat(formData.deliveryFee)

        let calculatedDataText

        // Validate delivery fee
        if (isNaN(deliveryFee)) {
            calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
        } else {
            calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nDelivery Fee: Rs. ${calculatedData.deliveryFee}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
        }

        // Create a temporary textarea element for copying to clipboard
        const textarea = document.createElement('textarea')
        textarea.value = calculatedDataText
        document.body.appendChild(textarea)

        // Select and copy the text
        textarea.select()
        document.execCommand('copy')

        // Remove the temporary textarea element
        document.body.removeChild(textarea)

        // Show Copied Message
        toast.success('Copied to clipboard')
    }

    return (
        <>
            <ToastContainer
                className={'px-3 md:px-0'}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="container">
                <form
                    onSubmit={handleCalculation}
                    className="mx-0 w-full max-w-[650px] rounded-lg bg-white px-4 py-8 shadow-md md:mx-auto lg:mx-0"
                >
                    {/* Logo and Calc Status */}
                    <div className="mb-5 flex items-center">
                        <img
                            src={images.kokoLogo}
                            alt="KOKO Logo"
                            loading="lazy"
                            width={128}
                        />
                        {discountMode && (
                            <div className="ml-auto flex flex-col items-center leading-none text-red-600/90">
                                <FaTag className="text-[2rem]" />
                                <p className="font-medium">{'50'}% OFF</p>
                            </div>
                        )}
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

                    <div className="flex w-full flex-col-reverse items-center gap-4 md:flex-row md:flex-wrap">
                        {!showCopyBtn && <div className="flex-1" />}
                        {showCopyBtn && (
                            <button
                                type="button"
                                className={
                                    'flex w-full justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-700 md:flex-1'
                                }
                                onClick={handleCopyToClipboard}
                            >
                                Copy to Clipboard
                            </button>
                        )}
                        <button
                            type="submit"
                            className={
                                'flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700 md:flex-1'
                            }
                        >
                            Calculate
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default KOKOPage
