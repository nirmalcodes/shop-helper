export const authErrorHelper = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email address',
            }))
            break
        case 'auth/user-disabled':
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'This user account has been disabled',
            }))
            break
        case 'auth/wrong-password':
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Invalid password',
            }))
            break
        case 'auth/user-not-found':
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'No user found with this email',
            }))
            break
        case 'auth/too-many-requests':
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Too many sign-in attempts. Try again later',
            }))
            break
        case 'auth/email-already-in-use':
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'This email is already in use',
            }))
            break
        default:
            setErrors({})
            break
    }
}
