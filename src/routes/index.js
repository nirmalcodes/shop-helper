import { lazy } from 'react'
import {
    FaHouse,
    FaEnvelopeOpenText,
    FaCalculator,
    FaGear,
} from 'react-icons/fa6'

const SignInPage = lazy(() => import('../pages/SignInPage/SignInPage'))

const HomePage = lazy(() => import('../pages/HomePage/HomePage'))
const KOKOPage = lazy(() => import('../pages/KOKOPage/KOKOPage'))
const UpdatesPage = lazy(() => import('../pages/UpdatesPage/UpdatesPage'))

const SettingsPage = lazy(() => import('../pages/SettingsPage/SettingsPage'))
const KOKOSettingsPage = lazy(
    () => import('../pages/KOKOSettingsPage/KOKOSettingsPage')
)

const ROUTES = [
    {
        id: 1,
        name: 'Sign in',
        icon: false,
        protected: false,
        path: '/signin',
        main: true,
        component: SignInPage,
        hiddenInSidebar: true,
        children: [],
    },
    {
        id: 2,
        name: 'Home',
        icon: FaHouse,
        protected: true,
        path: '/',
        main: true,
        component: HomePage,
        hiddenInSidebar: false,
        children: [],
    },
    {
        id: 3,
        name: 'KOKO',
        icon: FaCalculator,
        protected: true,
        path: '/koko',
        main: true,
        component: KOKOPage,
        hiddenInSidebar: false,
        children: [],
    },
    {
        id: 4,
        name: 'Updates',
        icon: FaEnvelopeOpenText,
        protected: true,
        path: '/updates',
        main: true,
        component: UpdatesPage,
        hiddenInSidebar: false,
        children: [],
    },
    {
        id: 5,
        name: 'Settings',
        icon: FaGear,
        protected: true,
        path: '/settings',
        main: true,
        component: SettingsPage,
        hiddenInSidebar: false,
        children: [
            {
                id: 1,
                name: 'User Settings',
                icon: false,
                path: '/user_settings',
                main: false,
                component: KOKOSettingsPage,
                hiddenInSidebar: true,
                children: [],
            },
            {
                id: 2,
                name: 'KOKO Settings',
                icon: false,
                path: '/koko_settings',
                main: false,
                component: KOKOSettingsPage,
                hiddenInSidebar: true,
                children: [],
            },
            {
                id: 3,
                name: 'Updates Settings',
                icon: false,
                path: '/Updates_settings',
                main: false,
                component: KOKOSettingsPage,
                hiddenInSidebar: true,
                children: [],
            },
        ],
    },
]

export default ROUTES
