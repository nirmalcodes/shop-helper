import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from '@firebase/firestore'
import { auth, firestore } from '../../services/firebase/firebase'
import { createUserWithEmailAndPassword } from '@firebase/auth'

const SignUp = () => {
    const { user, emailSignUp } = useContext(AuthContext)
    const location = useLocation()

    if (user && location.pathname !== '/') {
        return <Navigate to={'/'} replace />
    }

    const [isLoading, setIsLoading] = useState(false)
    const [isToggled, setIstoggled] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        setErrors({
            ...errors,
            [name]: '',
        })
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

    const usersCollectionRef = collection(firestore, 'users')

    const handleSignUp = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        const validationErrors = {}

        if (!formData.username.trim()) {
            validationErrors.username = 'Username is required'
        }
        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required'
        } else if (!isValidEmail(formData.email)) {
            validationErrors.email = 'Invalid email format'
        }
        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required'
        } else if (!isValidPassword(formData.password)) {
            validationErrors.password =
                'Password must be at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
        if (formData.role === 'choose') {
            validationErrors.role = 'Please choose a role'
        }

        const rolesQuery = query(
            usersCollectionRef,
            where('email', '==', formData.email)
        )
        const rolesSnapshot = await getDocs(rolesQuery)

        if (rolesSnapshot.empty) {
            validationErrors.email =
                "This email don't have permission to sign up. Please contact your Admin"
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsLoading(false)
        } else {
            try {
                const rolesQuery = query(
                    usersCollectionRef,
                    where('email', '==', formData.email)
                )
                const rolesSnapshot = await getDocs(rolesQuery)

                if (rolesSnapshot.empty) {
                    console.error('User not allowed to sign up')
                } else {
                    let docData
                    rolesSnapshot.forEach((doc) => {
                        // console.log(doc.id, ' => ', doc.data())
                        docData = {
                            id: doc.id,
                            ...doc.data(),
                        }
                        // console.log('pre auth data ', docData)
                        return docData
                    })

                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        formData.email,
                        formData.password
                    )
                    let registeredId = userCredential.user.uid

                    const docRef = doc(usersCollectionRef, registeredId)
                    await setDoc(docRef, {
                        username: formData.username,
                        email: formData.email,
                        role: docData.role,
                        createdBy: docData.createdBy,
                        createdAt: docData.createdAt,
                        registeredAt: serverTimestamp(),
                        restricted: false,
                    })

                    const oldDocRef = doc(usersCollectionRef, docData.id)
                    await deleteDoc(oldDocRef)
                }

                setFormData({
                    username: '',
                    email: '',
                    password: '',
                })
            } catch (error) {
                console.error(error)
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
                onSubmit={handleSignUp}
                className="w-full max-w-[360px] rounded-lg bg-white p-4 shadow-md"
                autoComplete="off"
            >
                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                    Sign Up
                </h4>
                <div className="mb-3">
                    <label
                        htmlFor="username"
                        className={
                            'mb-2 block text-sm font-medium text-gray-700'
                        }
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="off"
                        className={
                            'w-full appearance-none rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-300/30 disabled:text-gray-600'
                        }
                    />
                    {errors.username && (
                        <span className="text-sm text-red-600">
                            {errors.username}
                        </span>
                    )}
                </div>
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
                        autoComplete="off"
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
                            autoComplete="off"
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
                <button
                    type="submit"
                    className={
                        'flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium  text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700'
                    }
                >
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    )
}

export default SignUp
