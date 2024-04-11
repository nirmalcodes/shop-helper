import { useContext, useEffect, useRef } from 'react';
import ROUTES from '../routes';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const useRedirectIfLoggedIn = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const redirectPathRef = useRef(null);

    if (!redirectPathRef.current) {
        redirectPathRef.current = ROUTES.find(
            (route) => route.main && route.protected && !route.hiddenInSidebar
        )?.path;
    }

    useEffect(() => {
        const redirectPath = redirectPathRef.current;

        if (user && location.pathname !== redirectPath) {
            navigate(redirectPath);
        }

        return () => {};
    }, [user, location.pathname]);

    return null;
};

export default useRedirectIfLoggedIn;
