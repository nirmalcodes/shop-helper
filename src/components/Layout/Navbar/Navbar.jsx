import React, { Fragment, useContext, useEffect, useState } from 'react'
import {
    FaBars,
    FaArrowRightFromBracket,
    FaCircleUser,
    FaUser,
} from 'react-icons/fa6'
import { AuthContext } from '../../../contexts/AuthContext'
import { firestore } from '../../../services/firebase/firebase'
import { doc, getDoc } from '@firebase/firestore'
import { Menu, Transition } from '@headlessui/react'

const Navbar = ({ toggleOpen }) => {
    const { user, logOut } = useContext(AuthContext)
    const [docData, setDocData] = useState({})
    const [shortName, setShortName] = useState(null)

    const toggleSidebar = () => {
        toggleOpen((prev) => !prev)
    }

    const handleLogOut = async () => {
        await logOut()
    }

    const getFirstLetter = (word) => {
        if (typeof word === 'string' && word.length > 0) {
            return word[0].toUpperCase()
        } else {
            return 'Please enter a valid word'
        }
    }

    const fetchUsername = async (userId) => {
        try {
            const userDocRef = doc(firestore, 'users', userId)
            const docSnap = await getDoc(userDocRef)
            if (docSnap.exists()) {
                const username = docSnap.data().username
                const formattedName = getFirstLetter(username)
                setDocData({ ...docSnap.data() })
                setShortName(formattedName)
            }
        } catch (error) {
            // console.log(error)
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
                    <div className="">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full bg-gray-500/70 p-1 text-lg font-semibold text-white hover:bg-gray-500/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                    {shortName ?? (
                                        <FaUser className="text-sm" />
                                    )}
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    <div className="px-1 py-1 ">
                                        <Menu.Item>
                                            <div className="px-2 py-2">
                                                <p className="font-semibold capitalize">
                                                    {docData.username ?? '-'}
                                                    <span className="text-sm font-medium text-gray-400">
                                                        {' '}
                                                        ({docData.role ?? '-'})
                                                    </span>
                                                </p>
                                                <div className="text-sm text-gray-400">
                                                    {docData.email ?? '-'}
                                                </div>
                                            </div>
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-900'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    onClick={handleLogOut}
                                                >
                                                    <FaArrowRightFromBracket className="mr-1" />
                                                    Sign Out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar
