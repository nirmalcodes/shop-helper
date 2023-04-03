import { Route, Routes } from 'react-router-dom';
import { AdminPage, HomePage, LoginPage, NotFoundPage } from './pages';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
