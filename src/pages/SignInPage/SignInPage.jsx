import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router'

const SignInPage = () => {
    const { user, emailSignIn } = useContext(AuthContext)

    if (user) {
        return <Navigate to={'/home'} replace />
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault()
        await emailSignIn(email, password)
        // navigate('/home')
    }

    return (
        <>
            <div>SignInPage</div>
            <form onSubmit={handleSignIn}>
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
                <button type="submit">log in</button>
            </form>
        </>
    )
}

export default SignInPage
