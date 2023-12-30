import React, { useContext } from 'react'
import { FaBars, FaArrowRightFromBracket } from 'react-icons/fa6'
import { AuthContext } from '../../../contexts/AuthContext'

const Navbar = ({ toggleOpen }) => {
    const { user, logOut } = useContext(AuthContext)

    const toggleSidebar = () => {
        toggleOpen((prev) => !prev)
    }

    const handleLogOut = async () => {
        await logOut()
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
                <div className="ml-auto flex items-center gap-x-4">
                    <p className="">{user?.email}</p>
                    <button
                        type="button"
                        onClick={handleLogOut}
                        className={
                            'flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 p-2 text-xl font-medium  text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-700'
                        }
                    >
                        <FaArrowRightFromBracket />
                    </button>
                </div>
            </header>
        </>
    )
}

export default Navbar
