import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoutesProvider } from './contexts/RoutesContext'
import { ProtectedRoute } from './components'
import ROUTES from './routes'
import { firestore } from './services/firebase/firebase'
import { doc, getDoc, onSnapshot } from '@firebase/firestore'
import Loader from './components/Loader/Loader'
import { HelmetProvider } from 'react-helmet-async'

const SiteDisabled = lazy(() => import('./pages/SiteDisabled/SiteDisabled'))

const App = () => {
    const [isSiteActive, setIsSiteActive] = useState(true)

    const [user, setUser] = useState(
        localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user'))
            : null
    )

    const [userRole, setUserRole] = useState(
        localStorage.getItem('userRole')
            ? JSON.parse(localStorage.getItem('userRole'))
            : null
    )

    useEffect(() => {
        const siteConfigs = doc(firestore, 'siteConfigurations', 'configData')
        const unsubscribe = onSnapshot(siteConfigs, (doc) => {
            // console.log('Site Config data:', doc.data());
            const isActive = doc.data().isActive
            setIsSiteActive(isActive)
        })

        const getUserRole = async () => {
            try {
                const currentUser = user.uid
                const docRef = doc(firestore, 'users', currentUser)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const role = docSnap.data().role
                    localStorage.setItem('userRole', JSON.stringify(role))
                    setUserRole(role)
                }
            } catch (error) {
                // console.log(error)
            }
        }

        getUserRole()

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            <HelmetProvider>
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary
                        fallback={<div>Something went wrong...</div>}
                    >
                        {isSiteActive ? (
                            <AuthProvider>
                                <RoutesProvider>
                                    <Routes>
                                        {ROUTES.map((route) => {
                                            const routeComponent = (child) => (
                                                <Route
                                                    key={child.id}
                                                    path={
                                                        route.path + child.path
                                                    }
                                                    element={
                                                        route.protected ? (
                                                            <ProtectedRoute>
                                                                {child.component && (
                                                                    <child.component />
                                                                )}
                                                            </ProtectedRoute>
                                                        ) : (
                                                            child.component && (
                                                                <child.component />
                                                            )
                                                        )
                                                    }
                                                />
                                            )

                                            const shouldRenderRoute =
                                                userRole === 'root' ||
                                                userRole === 'admin' ||
                                                !(
                                                    userRole === 'user' &&
                                                    route.path.startsWith(
                                                        '/settings'
                                                    )
                                                )

                                            return shouldRenderRoute
                                                ? [
                                                      route.main && (
                                                          <Route
                                                              key={route.id}
                                                              path={route.path}
                                                              element={
                                                                  route.protected ? (
                                                                      <ProtectedRoute>
                                                                          {route.component && (
                                                                              <route.component />
                                                                          )}
                                                                      </ProtectedRoute>
                                                                  ) : (
                                                                      route.component && (
                                                                          <route.component />
                                                                      )
                                                                  )
                                                              }
                                                          />
                                                      ),
                                                      ...route.children.map(
                                                          routeComponent
                                                      ),
                                                  ]
                                                : null
                                        })}

                                        <Route
                                            path="*"
                                            element={
                                                <div>404 Page Not Found</div>
                                            }
                                        />
                                    </Routes>
                                </RoutesProvider>
                            </AuthProvider>
                        ) : (
                            <Routes>
                                <Route
                                    path="*"
                                    element={<Navigate to={'/'} replace />}
                                />
                                <Route path="/" element={<SiteDisabled />} />
                            </Routes>
                        )}
                    </ErrorBoundary>
                </Suspense>
            </HelmetProvider>
        </>
    )
}

export default App
