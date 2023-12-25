import React, { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { AuthContext } from '../../contexts/AuthContext'

const SignUpPage = () => {
    const { user, emailSignUp } = useContext(AuthContext)

    if (user) {
        return <Navigate to={'/'} replace />
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        await emailSignUp(email, password)
        // navigate('/')
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
