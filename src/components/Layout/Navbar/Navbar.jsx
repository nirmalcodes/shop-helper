import React, { useContext, useEffect, useState } from 'react'
import { FaBars, FaArrowRightFromBracket, FaCircleUser } from 'react-icons/fa6'
import { AuthContext } from '../../../contexts/AuthContext'
import { firestore } from '../../../services/firebase/firebase'
import { doc, getDoc } from '@firebase/firestore'

const Navbar = ({ toggleOpen }) => {
    const { user, logOut } = useContext(AuthContext)
    const [docData, setDocData] = useState({})

    const toggleSidebar = () => {
        toggleOpen((prev) => !prev)
    }

    const handleLogOut = async () => {
        await logOut()
    }

    const fetchUsername = async (userId) => {
        const userDocRef = doc(firestore, 'users', userId)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
            setDocData({ ...docSnap.data() })
        }
    }
    useEffect(() => {
        fetchUsername(user?.uid)
    }, [user])

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
                    <div className="flex items-center text-lg text-slate-700">
                        <FaCircleUser className="mr-1" />
                        {docData.username ?? '-'}
                    </div>
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
