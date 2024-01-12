import React, { useContext } from 'react'
import { FaRegHandshake } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import { RoutesContext } from '../../../contexts/RoutesContext'

const Sidebar = ({ open = true, toggleOpen }) => {
    const { routes } = useContext(RoutesContext)

    const toggleSidebar = () => {
        toggleOpen(false)
    }

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

                <nav className="h-[calc(100vh_-_56px)] max-h-[calc(100vh_-_56px)] overflow-hidden overflow-y-auto px-2 py-3">
                    <ul className="flex flex-shrink-0 flex-col gap-y-3">
                        {routes.map((route) => {
                            if (route?.hiddenInSidebar) {
                                return null
                            } else {
                                return (
                                    <li key={route?.id} onClick={toggleSidebar}>
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
                                )
                            }
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
