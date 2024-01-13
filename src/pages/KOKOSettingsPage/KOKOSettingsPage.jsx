import React, { useEffect, useState } from 'react'
import { Breadcrumbs, NumberInput } from '../../components'
import { Switch } from '@headlessui/react'
import { firestore } from '../../services/firebase/firebase'
import { doc, onSnapshot, setDoc } from '@firebase/firestore'

const KOKOSettingsPage = () => {
    const [docAvailable, setDocAvailable] = useState(false)
    const [formData, setFormData] = useState({
        feeRate: '',
        rate: '',
        maxCap: '',
    })
    const [enabled, setEnabled] = useState(false)
    const [errors, setErrors] = useState({
        feeRateError: '',
        rateError: '',
        maxCapError: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    // Function to handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
        setErrors({})
    }

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
            setFormData({
                feeRate: convenienceFeeRate,
                rate: discountRate,
                maxCap: discountMaxCap,
            })
            setEnabled(discountMode)
            setDocAvailable(true)
        })
        return () => {
            unsub()
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Convert all relevant form data values to numbers
        const cFeeRate = parseFloat(formData.feeRate)
        const discoRate = parseFloat(formData.rate)
        const discoMaxCap = parseFloat(formData.maxCap)

        // Validate form inputs
        if (formData.feeRate === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                feeRateError: 'Enter Convenience Fee Rate.',
            }))
            return
        }
        if (isNaN(cFeeRate) || cFeeRate < 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                feeRateError: 'Invalid Value.',
            }))
            return
        }

        if (enabled) {
            if (formData.rate === '') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    rateError: 'Enter Discount Rate.',
                }))
                return
            }
            if (isNaN(discoRate) || discoRate < 0) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    rateError: 'Invalid Value.',
                }))
                return
            }

            if (formData.maxCap === '') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    maxCapError: 'Enter Discount Max Cap.',
                }))
                return
            }
            if (isNaN(discoMaxCap) || discoMaxCap < 0) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    maxCapError: 'Invalid Value.',
                }))
                return
            }
        }

        setIsLoading(true)

        try {
            await setDoc(kokoConfigurationsRef, {
                convenienceFeeRate: cFeeRate,
                discountMode: enabled,
                discountRate: enabled ? discoRate : '',
                discountMaxCap: enabled ? discoMaxCap : '',
            })

            setErrors({})
        } catch (error) {
            console.error('Error saving form data:', error)
        }

        setIsLoading(false)
    }

    return (
        <>
            <Breadcrumbs />
            <div className="container px-4 py-5">
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="mx-0 w-full max-w-[650px] rounded-lg bg-white px-4 py-6 shadow-md md:mx-auto lg:mx-0"
                >
                    <h4 className="mb-8 text-center text-2xl font-medium text-gray-700">
                        KOKO Calc Configurations
                    </h4>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="feeRate"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Convenience Fee Rate
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <NumberInput
                                name="feeRate"
                                id="feeRate"
                                placeholder="Enter Convenience Fee Rate"
                                autoComplete="off"
                                className="form-input"
                                value={formData.feeRate}
                                onChange={handleInputChange}
                                // required
                            />
                            {errors.feeRateError && (
                                <span className="helper-text error-mssg text-sm font-medium">
                                    {errors.feeRateError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group flex-wrap md:flex">
                        <label
                            htmlFor="productPrice"
                            className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                        >
                            Discount Mode
                        </label>
                        <div className="md:w-4/6 md:px-4">
                            <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className={`relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75 ${
                                    enabled ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`${
                                        enabled
                                            ? 'translate-x-9'
                                            : 'translate-x-0'
                                    }
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                />
                            </Switch>
                        </div>
                    </div>

                    {enabled && (
                        <>
                            <div className="form-group flex-wrap md:flex">
                                <label
                                    htmlFor="rate"
                                    className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                                >
                                    Discount Rate
                                </label>
                                <div className="md:w-4/6 md:px-4">
                                    <NumberInput
                                        name="rate"
                                        id="rate"
                                        placeholder="Enter Discount Rate"
                                        autoComplete="off"
                                        className="form-input"
                                        value={formData.rate}
                                        onChange={handleInputChange}
                                        // required
                                    />
                                    {errors.rateError && (
                                        <span className="helper-text error-mssg text-sm font-medium">
                                            {errors.rateError}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group flex-wrap md:flex">
                                <label
                                    htmlFor="maxCap"
                                    className="form-label mb-2 text-sm font-medium text-slate-700 md:mb-0 md:w-1/3 md:px-4"
                                >
                                    Discount Max Cap
                                </label>
                                <div className="md:w-4/6 md:px-4">
                                    <NumberInput
                                        name="maxCap"
                                        id="maxCap"
                                        placeholder="Enter Discount Max Cap"
                                        autoComplete="off"
                                        className="form-input"
                                        value={formData.maxCap}
                                        onChange={handleInputChange}
                                        // required
                                    />
                                    {errors.maxCapError && (
                                        <span className="helper-text error-mssg text-sm font-medium">
                                            {errors.maxCapError}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mt-8 md:ml-auto md:w-1/2 md:px-4">
                        <button
                            type="submit"
                            className={`flex w-full justify-center rounded-lg border border-transparent  px-4 py-2 text-sm font-medium text-white shadow-sm   focus:outline-none focus:ring-2  focus:ring-offset-2  ${
                                docAvailable
                                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-600 disabled:bg-green-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600 disabled:bg-indigo-700'
                            }`}
                        >
                            {docAvailable
                                ? isLoading
                                    ? 'Updating...'
                                    : 'Update'
                                : isLoading
                                  ? 'Saving...'
                                  : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default KOKOSettingsPage
