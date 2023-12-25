import React from 'react'
import { FaRegHandshake } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import { FaLink } from 'react-icons/fa'

const Sidebar = ({ links = [], open = true }) => {
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

                <nav
                    className="p-2"
                    style={{
                        height: `calc(100vh - ${'56px'})`,
                    }}
                >
                    <ul className="flex flex-shrink-0 flex-col gap-y-3">
                        <li className="">
                            <NavLink to={'/'} className={'sidebar-link'}>
                                <FaLink />
                                <span className="text-sm leading-none">
                                    Home
                                </span>
                            </NavLink>
                        </li>
                        <li className="">
                            <NavLink to={'/koko'} className={'sidebar-link'}>
                                <FaLink />
                                <span className="text-sm leading-none">
                                    KOKO
                                </span>
                            </NavLink>
                        </li>
                        <li className="">
                            <NavLink to={'/updates'} className={'sidebar-link'}>
                                <FaLink />
                                <span className="text-sm leading-none">
                                    Updates
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
