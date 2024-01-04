import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import {
    HomePage,
    KOKOPage,
    SignInPage,
    SignUpPage,
    UpdatesPage,
} from './pages'
import { AuthProvider } from './contexts/AuthContext'
import { RoutesProvider } from './contexts/RoutesContext'
import { ProtectedRoute } from './components'

const App = () => {
    return (
        <>
            <Suspense>
                <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                    <AuthProvider>
                        <RoutesProvider>
                            <Routes>
                                <Route
                                    path={'signin'}
                                    element={<SignInPage />}
                                />
                                <Route
                                    path={'signup'}
                                    element={<SignUpPage />}
                                />

                                <Route
                                    path={'/'}
                                    element={
                                        <ProtectedRoute>
                                            <HomePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path={'koko'}
                                    element={
                                        <ProtectedRoute>
                                            <KOKOPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path={'updates'}
                                    element={
                                        <ProtectedRoute>
                                            <UpdatesPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path={'*'}
                                    element={<div>404 Page Not Found</div>}
                                />
                            </Routes>
                        </RoutesProvider>
                    </AuthProvider>
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default App
