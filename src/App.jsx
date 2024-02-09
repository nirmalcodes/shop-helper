import React, { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RoutesProvider } from './contexts/RoutesContext'
import { ProtectedRoute } from './components'
import ROUTES from './routes'
import { firestore } from './services/firebase/firebase'
import { doc, getDoc } from '@firebase/firestore'

const App = () => {
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
        return () => {}
    }, [])

    return (
        <>
            <Suspense>
                <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                    <AuthProvider>
                        <RoutesProvider>
                            <Routes>
                                {ROUTES.map((route) => {
                                    const routeComponent = (child) => (
                                        <Route
                                            key={child.id}
                                            path={route.path + child.path}
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
                                            route.path.startsWith('/settings')
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
