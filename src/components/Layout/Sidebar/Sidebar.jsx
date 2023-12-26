import React, { useContext } from 'react'
import { FaRegHandshake } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import { FaLink } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { RoutesContext } from '../../../contexts/RoutesContext'

const Sidebar = ({ links = [], open = true }) => {
    const { routes } = useContext(RoutesContext)

    return (
        <>
            <aside className={`sidebar ${open && 'open'}`}>
                <div className="flex h-14 flex-shrink-0 items-center justify-center gap-x-3 border-b text-4xl">
                    <FaRegHandshake />
                    {open && (
                        <div className={'hidden text-lg font-medium lg:block'}>
                            Shop Helper
                        </div>
                    )}
                </div>

                <nav className="h-[calc(100vh_-_56px)] max-h-[calc(100vh_-_56px)] overflow-hidden overflow-y-auto p-2">
                    <ul className="flex flex-shrink-0 flex-col gap-y-3">
                        {routes.map((route) => (
                            <li key={route?.id}>
                                <NavLink
                                    to={route?.path}
                                    className={'sidebar-link'}
                                >
                                    {route?.icon && <route.icon />}

                                    <span className="text-[0.8125rem] font-medium leading-none">
                                        {route?.name}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
