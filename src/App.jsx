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
import ROUTES from './routes'
// import { ROUTES } from './routes'

const App = () => {
    return (
        <>
            <Suspense>
                <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                    <AuthProvider>
                        <RoutesProvider>
                            <Routes>
                                {ROUTES.map((route) => {
                                    let mainRoutes = []
                                    let childRoutes = []

                                    // main routes mapping
                                    // main protected routes mapping
                                    if (route?.main && route?.protected) {
                                        mainRoutes = [
                                            <Route
                                                key={route?.id}
                                                path={route?.path}
                                                element={
                                                    <ProtectedRoute>
                                                        <route.component />
                                                    </ProtectedRoute>
                                                }
                                            />,
                                        ]
                                    }
                                    // main unprotected routes mapping
                                    if (
                                        route?.main &&
                                        route?.protected === false
                                    ) {
                                        mainRoutes = [
                                            <Route
                                                key={route?.id}
                                                path={route?.path}
                                                element={<route.component />}
                                            />,
                                        ]
                                    }

                                    // child routes mapping
                                    // child protected routes mapping
                                    if (
                                        route?.children.length > 0 &&
                                        route?.protected
                                    ) {
                                        childRoutes = route?.children.map(
                                            (child) => (
                                                <Route
                                                    key={child?.id}
                                                    path={
                                                        route?.path +
                                                        child?.path
                                                    }
                                                    element={
                                                        <ProtectedRoute>
                                                            <child.component />
                                                        </ProtectedRoute>
                                                    }
                                                />
                                            )
                                        )
                                    }

                                    // child unprotected routes mapping
                                    if (
                                        route?.children.length > 0 &&
                                        route?.protected === false
                                    ) {
                                        childRoutes = route?.children.map(
                                            (child) => (
                                                <Route
                                                    key={child?.id}
                                                    path={
                                                        route?.path +
                                                        child?.path
                                                    }
                                                    element={
                                                        <child.component />
                                                    }
                                                />
                                            )
                                        )
                                    }

                                    return [...mainRoutes, ...childRoutes]
                                })}

                                {/* <Route
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
                                /> */}

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
