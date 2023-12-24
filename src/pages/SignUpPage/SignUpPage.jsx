import React, { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
// import { registerUser } from '../../services/firebase/auth'
import { AuthContext } from '../../contexts/AuthContext'

const SignUpPage = () => {
    const { user, emailSignUp } = useContext(AuthContext)

    if (user) {
        return <Navigate to={'/home'} replace />
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    // const handleSignup = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const user = await registerUser(email, password)
    //         console.log('Sign Up Successful', user.email)
    //         navigate('/home')
    //     } catch (error) {
    //         console.log('Sign Up failed', error)
    //     }
    // }

    const handleSignup = async (e) => {
        e.preventDefault()
        await emailSignUp(email, password)
        // navigate('/home')
    }

    return (
        <>
            <div>SignUpPage</div>
            <form onSubmit={handleSignup}>
                <div className="">
                    <label htmlFor="email">email</label>
                    <input
                        type="email"
                        name="email"
                        id="eamil"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="">
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">register</button>
            </form>
        </>
    )
}

export default SignUpPage
