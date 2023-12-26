import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router'
import { HomePage, SignInPage, SignUpPage } from './pages'
import { AuthProvider } from './contexts/AuthContext'
import { RoutesProvider } from './contexts/RoutesContext'
import { ProtectedRoute } from './components'

const App = () => {
    return (
        <>
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FAFBFF]">
                <Suspense>
                    <ErrorBoundary
                        fallback={<div>Something went wrong...</div>}
                    >
                        <AuthProvider>
                            <RoutesProvider>
                                <Routes>
                                    <Route
                                        path={'/signin'}
                                        element={<SignInPage />}
                                    />
                                    <Route
                                        path={'/signup'}
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
                                        path={'/koko'}
                                        element={
                                            <ProtectedRoute>
                                                <HomePage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path={'/updates'}
                                        element={
                                            <ProtectedRoute>
                                                <HomePage />
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
            </div>
        </>
    )
}

export default App
