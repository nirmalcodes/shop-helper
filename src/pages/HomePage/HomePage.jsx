import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const HomePage = () => {
    const { user, logOut } = useContext(AuthContext)

    const handleLogOut = async () => {
        await logOut()
    }
    return (
        <>
            <div>HomePage</div>
            <p className="">Hello {user?.email}</p>
            <button type="button" onClick={handleLogOut}>
                log out
            </button>
        </>
    )
}

export default HomePage
