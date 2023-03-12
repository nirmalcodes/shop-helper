import { Route, Routes } from 'react-router-dom'
import { LoginPage, NotFoundPage } from './pages'

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default App
