import { FaHouse, FaEnvelopeOpenText, FaCalculator } from 'react-icons/fa6'

const routes = [
    {
        id: 1,
        name: 'Home',
        icon: FaHouse,
        path: '/',
        main: true,
        component: true,
        hiddenInSidebar: false,
        children: [],
    },
    {
        id: 2,
        name: 'KOKO',
        icon: FaCalculator,
        path: '/koko',
        main: true,
        component: true,
        hiddenInSidebar: false,
        children: [
            {
                id: 1,
                name: 'KOKO Settings',
                icon: false,
                path: '/koko-settings',
                main: false,
                component: true,
                hiddenInSidebar: true,
                children: [],
            },
        ],
    },
    {
        id: 3,
        name: 'Updates',
        icon: FaEnvelopeOpenText,
        path: '/updates',
        main: true,
        component: true,
        hiddenInSidebar: false,
        children: [],
    },
]

export default routes
