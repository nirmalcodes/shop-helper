import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router'
import { HomePage, SignInPage, SignUpPage } from './pages'

const App = () => {
    return (
        <>
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f1f1f1]">
                <Suspense>
                    <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                        <Routes>
                            <Route path={'/'} element={<SignUpPage />} />
                            <Route path={'/home'} element={<HomePage />} />
                            <Route path={'/login'} element={<SignInPage />} />
                            <Route
                                path={'*'}
                                element={<div>404 Page Not Found</div>}
                            />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
            </div>
        </>
    )
}

export default App
