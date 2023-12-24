import { auth } from './firebase'
import { createUserWithEmailAndPassword } from '@firebase/auth'

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredential.user
    } catch (error) {
        console.error('Error registering user:', error)
        // Add custom error handling here
    }
}

export const signIn = async (email, password) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(
            email,
            password
        )
        return userCredential.user
    } catch (error) {
        console.error('Error signing in user:', error)
        // Add custom error handling here
    }
}

export const signOut = async () => {
    try {
        await auth.signOut()
    } catch (error) {
        console.error('Error signing out:', error)
        // Add custom error handling here
    }
}

export const updatePassword = async (newPassword) => {
    try {
        const user = auth.currentUser
        await user.updatePassword(newPassword)
    } catch (error) {
        console.error('Error updating password:', error)
        // Add custom error handling here
    }
}
