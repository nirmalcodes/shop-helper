import { auth } from './firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
} from '@firebase/auth'

export const signUpWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredential.user
    } catch (error) {
        console.error('Error registering user:', error)
    }
}

export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredential.user
    } catch (error) {
        console.error('Error signing in user:', error)
        // Add custom error handling here
    }
}

export const updateUserPassword = async (newPassword) => {
    try {
        const user = auth.currentUser
        await updatePassword(user, newPassword)
    } catch (error) {
        console.error('Error updating password:', error)
        // Add custom error handling here
    }
}

export const signOutUser = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error('Error signing out:', error)
        // Add custom error handling here
    }
}
