import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
    return (
        <>
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f1f1f1]">
                <Suspense>
                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                        App Update
                    </ErrorBoundary>
                </Suspense>
            </div>
        </>
    )
}

export default App
