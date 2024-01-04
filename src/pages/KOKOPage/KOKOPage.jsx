import React, { useState } from 'react'
import { NumberInput } from '../../components'
import { images } from '../../utils/constants'
import { FaTag } from 'react-icons/fa6'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const KOKOPage = () => {
    const [convenienceFeeRate, setConvenienceFeeRate] = useState(6)
    const [discountMode, setDiscountMode] = useState(false)

    const [errors, setErrors] = useState({
        productPriceError: '',
        deliveryFeeError: '',
    })

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

    // Function to handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
        setErrors({})
    }

    const handleCalculation = (e) => {
        e.preventDefault()

        // Convert all relevant form data values to numbers
        const productPrice = parseFloat(formData.productPrice)
        const deliveryFee = parseFloat(formData.deliveryFee) || 0 // Default to 0 if deliveryFee is not provided

        // Define constants
        let convenienFeePercentage = (100 - convenienceFeeRate) / 100

        // Validate form inputs
        if (formData.productPrice === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                productPriceError: 'Enter Product Price.',
            }))
            return
        }
        if (isNaN(productPrice) || productPrice < 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                productPriceError: 'Invalid Value.',
            }))
            return
        }
        if (isNaN(deliveryFee) || deliveryFee < 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                deliveryFeeError: 'Invalid Delivery Fee.',
            }))
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
        setShowCopyBtn(true)
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
                    autoComplete="off"
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
                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="productPrice"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Product Price
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="productPrice"
                                id="productPrice"
                                placeholder="Enter Product Price"
                                autoComplete="off"
                                className="form-input"
                                autoFocus
                                value={formData.productPrice}
                                onChange={handleInputChange}
                                // required
                            />
                            {errors.productPriceError && (
                                <span className="helper-text error-mssg text-sm font-medium">
                                    {errors.productPriceError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="deliveryFee"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Delivery Fee
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="deliveryFee"
                                id="deliveryFee"
                                placeholder="Enter Delivery Fee"
                                autoComplete="off"
                                className="form-input"
                                value={formData.deliveryFee}
                                onChange={handleInputChange}
                            />
                            {errors.deliveryFeeError && (
                                <span className="helper-text error-mssg text-sm font-medium">
                                    {errors.deliveryFeeError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="convenienceFee"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Convenience Fee
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="convenienceFee"
                                id="convenienceFee"
                                className="form-input"
                                value={formData.convenienceFee}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="totalWithConvenienceFee"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Total with Convenience Fee
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="totalWithConvenienceFee"
                                id="totalWithConvenienceFee"
                                className="form-input"
                                value={formData.totalWithConvenienceFee}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="installmentPerMonth"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Installment Per Month
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="installmentPerMonth"
                                id="installmentPerMonth"
                                className="form-input"
                                value={formData.installmentPerMonth}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col-reverse gap-y-3 md:flex-row md:flex-wrap">
                        {showCopyBtn && (
                            <div className="md:w-1/2 md:px-4">
                                <button
                                    type="button"
                                    className="flex w-full justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-green-700"
                                    onClick={handleCopyToClipboard}
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                        )}
                        <div className="md:ml-auto md:w-1/2 md:px-4">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700"
                            >
                                Calculate
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default KOKOPage
