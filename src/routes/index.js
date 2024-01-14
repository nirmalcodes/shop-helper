import { lazy } from 'react'
import {
    FaHouse,
    FaEnvelopeOpenText,
    FaCalculator,
    FaGear,
} from 'react-icons/fa6'

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))

const Home = lazy(() => import('../pages/Home/Home'))
const KOKO = lazy(() => import('../pages/KOKO/KOKO'))
const Updates = lazy(() => import('../pages/Updates/Updates'))

const Settings = lazy(() => import('../pages/Settings/Settings'))
const KOKOSettings = lazy(() => import('../pages/KOKOSettings/KOKOSettings'))
const UserSettings = lazy(() => import('../pages/UserSettings/UserSettings'))
const UpdatesSettings = lazy(() => import('../pages/UpdatesSettings/UpdatesSettings'))

const ROUTES = [
    {
        id: 1,
        name: 'Sign in',
        icon: false,
        protected: false,
        path: '/signin',
        main: true,
        component: SignIn,
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
        component: Home,
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
        component: KOKO,
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
        component: Updates,
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
        component: Settings,
        hiddenInSidebar: false,
        children: [
            {
                id: 1,
                name: 'User Settings',
                icon: false,
                path: '/user_settings',
                main: false,
                component: UserSettings,
                hiddenInSidebar: true,
                children: [],
            },
            {
                id: 2,
                name: 'KOKO Settings',
                icon: false,
                path: '/koko_settings',
                main: false,
                component: KOKOSettings,
                hiddenInSidebar: true,
                children: [],
            },
            {
                id: 3,
                name: 'Updates Settings',
                icon: false,
                path: '/updates_settings',
                main: false,
                component: UpdatesSettings,
                hiddenInSidebar: true,
                children: [],
            },
        ],
    },
]

export default ROUTES
