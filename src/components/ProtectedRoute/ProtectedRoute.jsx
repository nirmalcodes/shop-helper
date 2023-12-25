import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to={'/signin'} replace />
    }

    return children
}

export default ProtectedRoute
