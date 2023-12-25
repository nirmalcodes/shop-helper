import React from 'react'
import { FaBars } from 'react-icons/fa6'

const Navbar = ({ toggleOpen }) => {
    const toggleSidebar = () => {
        toggleOpen((prev) => !prev)
    }

    return (
        <>
            <header className="navbar">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="rounded border p-2 text-xl"
                >
                    <FaBars />
                </button>
                <div className="ml-auto">
                    <button type="button">log</button>
                </div>
            </header>
        </>
    )
}

export default Navbar
