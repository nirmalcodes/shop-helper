import { createContext, useEffect, useState } from 'react'
import { auth } from '../services/firebase/firebase'
import { onAuthStateChanged } from '@firebase/auth'
import {
    signInWithEmail,
    signUpWithEmail,
    updateUserPassword,
    signOutUser,
} from '../services/firebase/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(null)
    const [user, setUser] = useState(
        localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user'))
            : null
    )

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         setUser(user)
    //     })

    //     return () => {
    //         unsubscribe()
    //     }
    // }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)
        })

        return () => unsubscribe()
    }, [])

    const emailSignIn = async (email, password) => {
        await signInWithEmail(email, password)
        // try {
        // await signInWithEmail(email, password)
        // const userCredential = await signInWithEmail(email, password)
        // setUser(userCredential.user)
        // } catch (error) {
        // return error
        // Handle sign-in error
        // }
    }

    const emailSignUp = async (email, password) => {
        await signUpWithEmail(email, password)
        // try {
        // await signUpWithEmail(email, password)
        // Handle successful registration
        // } catch (error) {
        // return error
        // Handle registration error
        // }
    }

    const updatePassword = async (newPassword) => {
        try {
            await updateUserPassword(newPassword)
            // Handle successful password update
        } catch (error) {
            // Handle password update error
        }
    }

    const logOut = async () => {
        try {
            await signOutUser()
            localStorage.removeItem('user') // Clear user state from localStorage
            setUser(null)
        } catch (error) {
            // Handle sign-out error
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, emailSignIn, emailSignUp, updatePassword, logOut }}
        >
            {children}
        </AuthContext.Provider>
    )
}
