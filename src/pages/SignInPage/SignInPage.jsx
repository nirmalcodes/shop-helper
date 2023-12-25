import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { validateForm } from '../../utils/helpers/validators/SignInUpFormValidator'

const SignInPage = () => {
    const { user, emailSignIn } = useContext(AuthContext)

    if (user) {
        return <Navigate to={'/'} replace />
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isToggled, setIstoggled] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault()
        await emailSignIn(email, password)
        // navigate('/')
    }

    const togglePassword = () => {
        setIstoggled((prev) => !prev)
    }

    return (
        <div
            className={
                'flex w-full flex-1 flex-col items-center justify-center p-4'
            }
        >
            <form
                onSubmit={handleSignIn}
                className="w-full max-w-[360px] rounded-lg bg-white p-4 shadow-md"
            >
                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                    Log in
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
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={
                            'w-full appearance-none rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-300/30 disabled:text-gray-600'
                        }
                    />
                    <span className="text-sm text-red-600">Error Message</span>
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
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <span className="text-sm text-red-600">Error Message</span>
                </div>
                <button
                    type="submit"
                    className={
                        'flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium  text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700'
                    }
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default SignInPage
