import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import Layout from '../Layout/Layout'

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to={'/signin'} replace />
    }

    return <Layout>{children}</Layout>
}

export default ProtectedRoute
