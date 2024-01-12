import React, { useEffect, useState } from 'react'
import { NumberInput } from '../../components'
import { images } from '../../utils/constants'
import { FaTag } from 'react-icons/fa6'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { firestore } from '../../services/firebase/firebase'
import { doc, onSnapshot } from '@firebase/firestore'

const KOKOPage = () => {
    const [convenienceRate, setConvenienceRate] = useState(0)
    const [isDiscounted, setIsDiscounted] = useState(false)
    const [disRate, setDisRate] = useState(0)
    const [disMaxCap, setDisMaxCap] = useState(0)

    const kokoConfigurationsRef = doc(
        firestore,
        'kokoConfigurations',
        'configData'
    )

    useEffect(() => {
        const unsub = onSnapshot(kokoConfigurationsRef, (doc) => {
            // console.log('Current data: ', doc.data())
            const {
                convenienceFeeRate,
                discountMode,
                discountRate,
                discountMaxCap,
            } = doc.data()
            setConvenienceRate(convenienceFeeRate)
            setIsDiscounted(discountMode)
            setDisRate(discountRate)
            setDisMaxCap(discountMaxCap)
        })
        return () => {
            unsub()
        }
    }, [])

    const [errors, setErrors] = useState({
        productPriceError: '',
        deliveryFeeError: '',
    })

    const [formData, setFormData] = useState({
        productPrice: '',
        deliveryFee: '',
        discount: '',
        discountedPrice: '',
        convenienceFee: '',
        totalWithConvenienceFee: '',
        installmentPerMonth: '',
    })

    const [calculatedData, setCalculatedData] = useState({
        productPrice: '',
        deliveryFee: '',
        discount: '',
        discountedPrice: '',
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

    // Function to handle normal mode calculations
    const handleCalculation = (e) => {
        e.preventDefault()

        // Convert all relevant form data values to numbers
        const productPrice = parseFloat(formData.productPrice)
        const deliveryFee = parseFloat(formData.deliveryFee) || 0 // Default to 0 if deliveryFee is not provided

        // Define constants
        let convenienFeePercentage = (100 - convenienceRate) / 100

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

        const totalWithConvenienceFee =
            priceWithDelivery / convenienFeePercentage

        const calculatedConvenienceFee =
            totalWithConvenienceFee - priceWithDelivery

        const installmentPerMonth = totalWithConvenienceFee / 3

        const fixedCFee = calculatedConvenienceFee.toFixed(2)
        const fixedTotWCFee = totalWithConvenienceFee.toFixed(2)
        const fixedInsPerMonth = installmentPerMonth.toFixed(2)

        // Update formData with the calculated values
        setFormData({
            ...formData,
            convenienceFee: parseFloat(fixedCFee),
            totalWithConvenienceFee: parseFloat(fixedTotWCFee),
            installmentPerMonth: parseFloat(fixedInsPerMonth),
        })

        // Set clipboard text
        setCalculatedData({
            productPrice,
            deliveryFee,
            convenienceFee: parseFloat(fixedCFee),
            totalWithConvenienceFee: parseFloat(fixedTotWCFee),
            installmentPerMonth: parseFloat(fixedInsPerMonth),
        })

        // Set showCopyBtn
        setShowCopyBtn(true)
    }

    // Function to handle normal mode calculations
    const handleDiscountCalculation = (e) => {
        e.preventDefault()

        // Convert all relevant form data values to numbers
        const productPrice = parseFloat(formData.productPrice)
        const deliveryFee = parseFloat(formData.deliveryFee) || 0 // Default to 0 if deliveryFee is not provided

        let convenienFeePercentage = (100 - convenienceRate) / 100

        let discountPercentage = disRate / 100

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
        const clacDiscount = productPrice * discountPercentage

        let maxCapBal = 0,
            discountedPrice = 0

        if (clacDiscount > disMaxCap) {
            maxCapBal = clacDiscount - disMaxCap

            discountedPrice = productPrice - disMaxCap
        } else {
            discountedPrice = productPrice - clacDiscount
        }

        const priceWithDelivery = discountedPrice + deliveryFee

        const totalWithConvenienceFee =
            priceWithDelivery / convenienFeePercentage

        const calculatedConvenienceFee =
            totalWithConvenienceFee - priceWithDelivery

        const installmentPerMonth = totalWithConvenienceFee / 3

        const discountValue = clacDiscount - maxCapBal

        const fixedDiscount = discountValue.toFixed(2)
        const fixedDiscountedPrice = discountedPrice.toFixed(2)
        const fixedCFee = calculatedConvenienceFee.toFixed(2)
        const fixedTotWCFee = totalWithConvenienceFee.toFixed(2)
        const fixedInsPerMonth = installmentPerMonth.toFixed(2)

        // Update formData with the calculated values
        setFormData({
            ...formData,
            discount: parseFloat(fixedDiscount),
            discountedPrice: parseFloat(fixedDiscountedPrice),
            convenienceFee: parseFloat(fixedCFee),
            totalWithConvenienceFee: parseFloat(fixedTotWCFee),
            installmentPerMonth: parseFloat(fixedInsPerMonth),
        })

        // Set clipboard text
        setCalculatedData({
            productPrice,
            deliveryFee,
            discount: parseFloat(fixedDiscount),
            discountedPrice: parseFloat(fixedDiscountedPrice),
            convenienceFee: parseFloat(fixedCFee),
            totalWithConvenienceFee: parseFloat(fixedTotWCFee),
            installmentPerMonth: parseFloat(fixedInsPerMonth),
        })

        // Set showCopyBtn
        setShowCopyBtn(true)
    }

    // Function for copy to clipboard (old way)
    const handleCopyToClipboard = () => {
        const deliveryFee = parseFloat(formData.deliveryFee)

        let calculatedDataText

        if (isDiscounted) {
            // Validate delivery fee
            if (isNaN(deliveryFee)) {
                calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nDiscount: Rs. ${calculatedData.discount}/=\nDiscounted Price: Rs. ${calculatedData.discountedPrice}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
            } else {
                calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nDelivery Fee: Rs. ${calculatedData.deliveryFee}/=\nDiscount: Rs. ${calculatedData.discount}/=\nDiscounted Price: Rs. ${calculatedData.discountedPrice}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
            }
        } else {
            // Validate delivery fee
            if (isNaN(deliveryFee)) {
                calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
            } else {
                calculatedDataText = `Product Price: Rs. ${calculatedData.productPrice}/=\nDelivery Fee: Rs. ${calculatedData.deliveryFee}/=\nConvenience Fee: Rs. ${calculatedData.convenienceFee}/=\nTotal with Convenience Fee: Rs. ${calculatedData.totalWithConvenienceFee}/=\nInstallment Per Month: Rs. ${calculatedData.installmentPerMonth}/=`
            }
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
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="dark"
            />
            <div className="container px-4 py-5">
                <form
                    onSubmit={
                        isDiscounted
                            ? handleDiscountCalculation
                            : handleCalculation
                    }
                    // onSubmit={handleCalculation}
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
                        {isDiscounted && (
                            <div className="ml-auto flex flex-col items-center leading-none text-red-600/90">
                                <FaTag className="text-[2rem]" />
                                <p className="font-medium">{disRate}% OFF</p>
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

                    {isDiscounted && (
                        <>
                            <div className="form-group flex-wrap md:flex">
                                <label
                                    htmlFor="discount"
                                    className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                                >
                                    Discount
                                </label>
                                <div className="md:w-4/6 md:px-4">
                                    <NumberInput
                                        name="discount"
                                        id="discount"
                                        className="form-input"
                                        value={formData.discount}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-group flex-wrap md:flex">
                                <label
                                    htmlFor="discountedPrice"
                                    className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                                >
                                    Discounted Price
                                </label>
                                <div className="md:w-4/6 md:px-4">
                                    <NumberInput
                                        name="discountedPrice"
                                        id="discountedPrice"
                                        className="form-input"
                                        value={formData.discountedPrice}
                                        disabled
                                    />
                                </div>
                            </div>
                        </>
                    )}
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
