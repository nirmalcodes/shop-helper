import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { auth, firestore } from '../../../services/firebase/firebase'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { sendPasswordResetEmail } from '@firebase/auth'

const PasswordResetModal = ({ isOpen = false, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        common: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [countdown, setCountdown] = useState(60)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setErrors({ ...errors, [name]: '' })
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccess(false)
        setErrors({})

        const validationErrors = {}

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required'
        } else if (!isValidEmail(formData.email)) {
            validationErrors.email = 'Invalid email format'
        }

        try {
            const accessGrantedUsers = collection(
                firestore,
                'accessGrantedUsers'
            )
            const usersQuery = query(
                accessGrantedUsers,
                where('email', '==', formData.email)
            )
            const usersSnapshot = await getDocs(usersQuery)

            if (usersSnapshot.empty) {
                validationErrors.email =
                    "Can't find an account associated with this email. Please contact your Admin"
            }
        } catch (error) {
            console.error(error)
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsLoading(false)
        } else {
            try {
                await sendPasswordResetEmail(auth, formData.email)
                // console.log('Password reset email sent!')

                setSuccess(true)
                setSent(true)
                setIsButtonDisabled(true)
                setCountdown(60)
            } catch (error) {
                console.error(error)
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let interval

        if (isButtonDisabled) {
            interval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isButtonDisabled])

    useEffect(() => {
        // Enable the button after 60 seconds
        if (countdown === 0) {
            setIsButtonDisabled(false)
        }
    }, [countdown])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                    setFormData({})
                    onClose()
                }}
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
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Password reset
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        To reset your password please enter your
                                        account email. Or ask your admin to send
                                        a password reset link to you.
                                    </p>
                                    <form
                                        onSubmit={handlePasswordReset}
                                        className="mt-4"
                                    >
                                        <div className="mb-[6px]">
                                            <label
                                                htmlFor="email"
                                                className={
                                                    'mb-2 block text-sm font-medium text-gray-700'
                                                }
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="eamil"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className={
                                                    'w-full appearance-none rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-300/30 disabled:text-gray-600'
                                                }
                                            />
                                            {errors.email && (
                                                <span className="text-sm text-red-600">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>
                                        {success && (
                                            <p className="text-sm text-gray-500">
                                                A password reset link has been
                                                sent to your email. Please check
                                                your inbox
                                            </p>
                                        )}
                                        <div className="mt-8 flex gap-3">
                                            <button
                                                type="reset"
                                                className="flex w-full justify-center rounded-lg border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all duration-100  ease-in hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                                                onClick={() => {
                                                    setFormData({})
                                                    onClose()
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            {sent ? (
                                                <button
                                                    type="submit"
                                                    className="flex w-full justify-center rounded-lg border border-transparent  bg-indigo-600 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700"
                                                    disabled={isButtonDisabled}
                                                >
                                                    {isButtonDisabled
                                                        ? `${countdown} seconds`
                                                        : isLoading
                                                          ? 'Re sending...'
                                                          : 'Re send'}
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="flex w-full justify-center rounded-lg border border-transparent  bg-indigo-600 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700"
                                                    disabled={isButtonDisabled}
                                                >
                                                    {isLoading
                                                        ? 'Sending...'
                                                        : 'Send'}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default PasswordResetModal
