import { useContext } from 'react';
import ROUTES from '../routes';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const useRedirectIfLoggedIn = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const redirectPath = ROUTES.find(
        (route) => route.main && route.protected && !route.hiddenInSidebar
    )?.path;

    if (user && location.pathname !== redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    return null;
};

export default useRedirectIfLoggedIn;
