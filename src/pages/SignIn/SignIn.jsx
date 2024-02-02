import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { validateForm } from '../../utils/helpers/validators/SignInUpFormValidator'
import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../services/firebase/firebase'

const SignIn = () => {
    const { user, emailSignIn } = useContext(AuthContext)
    const location = useLocation()

    if (user && location.pathname !== '/') {
        return <Navigate to={'/'} replace />
    }

    const [isLoading, setIsLoading] = useState(false)
    const [isToggled, setIstoggled] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        common: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setErrors({ ...errors, [name]: '' })
    }

    const togglePassword = () => {
        setIstoggled((prev) => !prev)
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidPassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordRegex.test(password)
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        const validationErrors = {}

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required'
        } else if (!isValidEmail(formData.email)) {
            validationErrors.email = 'Invalid email format'
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required'
        } else if (!isValidPassword(formData.password)) {
            validationErrors.password = 'Password must be at least 8 characters'
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsLoading(false)
        } else {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                )
                setFormData({})
            } catch (error) {
                const errorCode = error.code

                if (errorCode === 'auth/invalid-email') {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Invalid email address',
                    }))
                } else if (errorCode === 'auth/user-not-found') {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'This email is not registered',
                    }))
                } else if (errorCode === 'auth/wrong-password') {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: 'Incorrect password',
                    }))
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        common: 'An error occurred. Please try again later',
                    }))
                }
            }
            setIsLoading(false)
        }
    }

    return (
        <div
            className={
                'flex min-h-screen w-full flex-1 flex-col items-center justify-center p-5'
            }
        >
            <form
                onSubmit={handleSignIn}
                className="w-full max-w-[360px] rounded-lg bg-white p-4 shadow-md"
            >
                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                    Log In
                </h4>
                <div className="mb-3">
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
                <div className="mb-8">
                    <label
                        htmlFor="password"
                        className={
                            'mb-2 block text-sm font-medium text-gray-700'
                        }
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={isToggled ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className={
                                'w-full appearance-none rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-300/30 disabled:text-gray-600'
                            }
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className={
                                'absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-700/60 transition-all duration-150 hover:bg-slate-400/40'
                            }
                        >
                            {isToggled ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-sm text-red-600">
                            {errors.password}
                        </span>
                    )}
                </div>
                {errors.common && (
                    <span className="text-sm text-red-600">
                        {errors.common}
                    </span>
                )}
                <button
                    type="submit"
                    className={
                        'flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium  text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700'
                    }
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </div>
    )
}

export default SignIn
