import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FaChevronRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const Settings = () => {
    const tabs = [
        { id: 1, name: 'User Settings', path: '/settings/user_settings' },
        { id: 2, name: 'KOKO Settings', path: '/settings/koko_settings' },
    ]

    return (
        <>
            <Helmet>
                <title>Shop Helper | Settings</title>
            </Helmet>
            <div className="container grid grid-cols-1 gap-3 px-4 py-5">
                {tabs.map((tab) => (
                    <Link key={tab?.id} to={tab?.path}>
                        <div className="flex items-center rounded-md border bg-white p-4 shadow-md">
                            <h5 className="text-lg">{tab?.name}</h5>
                            <FaChevronRight className="ml-auto text-lg" />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Settings
