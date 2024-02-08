import { lazy } from 'react'
import {
    FaHouse,
    FaComments,
    FaCalculator,
    FaGear,
} from 'react-icons/fa6'

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp/SignUp'))

const Home = lazy(() => import('../pages/Home/Home'))
const KOKO = lazy(() => import('../pages/KOKO/KOKO'))
const Chat = lazy(() => import('../pages/Chat/Chat'))

const Settings = lazy(() => import('../pages/Settings/Settings'))
const KOKOSettings = lazy(() => import('../pages/KOKOSettings/KOKOSettings'))
const UserSettings = lazy(() => import('../pages/UserSettings/UserSettings'))

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
        name: 'Sign Up',
        icon: false,
        protected: false,
        path: '/signup',
        main: true,
        component: SignUp,
        hiddenInSidebar: true,
        children: [],
    },
    {
        id: 3,
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
        id: 4,
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
        id: 5,
        name: 'Chat',
        icon: FaComments,
        protected: true,
        path: '/chat',
        main: true,
        component: Chat,
        hiddenInSidebar: false,
        children: [],
    },
    {
        id: 6,
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
                hiddenInSidAebar: true,
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
        ],
    },
]

export default ROUTES
