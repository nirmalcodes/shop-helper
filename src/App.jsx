import { Route, Routes } from 'react-router-dom';
import { AdminPage, HomePage, LoginPage, NotFoundPage } from './pages';
import { AuthContextProvider } from './context/AuthContext';
import { ProtectedRoute } from './components';

function App() {
    return (
        <>
            <AuthContextProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthContextProvider>
        </>
    );
}

export default App;
