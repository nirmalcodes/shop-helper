import React, { Fragment, lazy, useContext, useEffect, useState } from 'react'
import { Breadcrumbs } from '../../components'
import { FaTrashCan, FaPen, FaLockOpen } from 'react-icons/fa6'
import { Dialog, Transition } from '@headlessui/react'
import { data } from '../../utils/constants'
import { AuthContext } from '../../contexts/AuthContext'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from '@firebase/firestore'
import { firestore, auth } from '../../services/firebase/firebase'
import { sendPasswordResetEmail } from '@firebase/auth'

const DeleteModal = lazy(
    () => import('../../components/Modals/DeleteModal/DeleteModal')
)
const EditModal = lazy(
    () => import('../../components/Modals/EditModal/EditModal')
)

export const ResetBtn = ({ email }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [countdown, setCountdown] = useState(60)

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, email)
            // console.log('Password reset email sent!')

            setIsButtonDisabled(true)
            setCountdown(60)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        let interval

        if (isButtonDisabled) {
            interval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isButtonDisabled])

    useEffect(() => {
        // Enable the button after 60 seconds
        if (countdown === 0) {
            setIsButtonDisabled(false)
        }
    }, [countdown])

    return (
        <button
            type="button"
            title="Password reset"
            className="rounded bg-sky-200/50 p-2 text-sky-600 transition-all duration-100 ease-in hover:bg-sky-200 disabled:bg-gray-200 disabled:text-gray-600"
            disabled={isButtonDisabled}
            onClick={handlePasswordReset}
        >
            {isButtonDisabled ? (
                <p className="text-xs font-medium">{`${countdown}s`}</p>
            ) : (
                <FaLockOpen />
            )}
        </button>
    )
}

export const StatusPill = ({ email }) => {
    const [status, setStatus] = useState({
        label: 'Loading...',
        value: false,
    })

    useEffect(() => {
        const handleAccStatus = async (mail) => {
            try {
                const aGUsersRef = collection(firestore, 'accessGrantedUsers')
                const usersRef = collection(firestore, 'users')

                const aGUQuery = query(aGUsersRef, where('email', '==', mail))
                const usersQuery = query(usersRef, where('email', '==', mail))

                const aGUQSnapshot = await getDocs(aGUQuery)
                const usersQSnapshot = await getDocs(usersQuery)

                if (!aGUQSnapshot.empty && !usersQSnapshot.empty) {
                    // console.log('active account found')
                    setStatus({
                        label: 'Active',
                        value: true,
                    })
                } else if (!aGUQSnapshot.empty && usersQSnapshot.empty) {
                    // console.log('pending activation account found')
                    setStatus({
                        label: 'Pending Activation',
                        value: false,
                    })
                } else {
                    // console.log('no account found')
                    setStatus({
                        label: 'Not found',
                        value: false,
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }

        handleAccStatus(email)
        return () => {}
    }, [email])

    return (
        <div
            className={`mx-auto w-fit rounded-full px-4 py-2 text-sm font-medium capitalize leading-none ${
                status.value
                    ? 'bg-green-200/50 text-green-600'
                    : 'bg-gray-200/50 text-gray-500'
            }`}
        >
            {status.label ?? '...'}
        </div>
    )
}

const UserSettings = () => {
    const { user } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDltOpen, setIsDltOpen] = useState(false)

    const [documentId, setDocumentId] = useState(null)

    const [users, setUsers] = useState([])

    const [formData, setFormData] = useState({
        email: '',
        role: 'choose',
    })

    const [errors, setErrors] = useState({
        email: '',
        role: '',
    })

    const openAddModal = () => {
        setIsAddOpen(true)
    }
    const closeAddModal = () => {
        setFormData({})
        setErrors({})
        setIsAddOpen(false)
    }

    const openEditModal = (id) => {
        setDocumentId(id)
        setIsEditOpen(true)
    }
    const closeEditModal = () => {
        setDocumentId(null)
        setIsEditOpen(false)
    }

    const openDltModal = (id) => {
        setDocumentId(id)
        setIsDltOpen(true)
    }
    const closeDltModal = () => {
        setDocumentId(null)
        setIsDltOpen(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        setErrors({
            ...errors,
            [name]: '',
        })
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const accessGrantedUsers = collection(firestore, 'accessGrantedUsers')

    const handleAddUser = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const validationErrors = {}

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required'
        } else if (!isValidEmail(formData.email)) {
            validationErrors.email = 'Invalid email format'
        }
        if (formData.role === 'choose') {
            validationErrors.role = 'Please choose a role'
        }

        try {
            let maxUsersLimit = 0
            let currentUsersCount = 0

            //get allowed max users count from site config doc
            const siteConfigs = doc(
                firestore,
                'siteConfigurations',
                'configData'
            )
            const docSnap = await getDoc(siteConfigs)

            if (docSnap.exists()) {
                maxUsersLimit = docSnap.data().maxUsers
            }

            // console.log('max users: ', maxUsersLimit)

            // get how many users currently in the system
            const currentUsers = await getDocs(accessGrantedUsers)
            const count = currentUsers.size
            currentUsersCount = count
            // console.log('user count with new user:', currentUsersCount)

            if (currentUsersCount > maxUsersLimit) {
                validationErrors.email = 'Max users count reached!'
            }

            const rolesQuery = query(
                accessGrantedUsers,
                where('email', '==', formData.email)
            )
            const rolesSnapshot = await getDocs(rolesQuery)

            if (!rolesSnapshot.empty) {
                validationErrors.email = 'This email is already in use'
            }
        } catch (error) {
            console.error(error)
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsLoading(false)
        } else {
            try {
                const docData = {
                    email: formData.email,
                    role: formData.role,
                    createdBy: user.email,
                    createdAt: serverTimestamp(),
                    restricted: false,
                }
                await addDoc(accessGrantedUsers, docData)

                setFormData({
                    email: '',
                    role: 'choose',
                })
                setIsLoading(false)
                setIsAddOpen(false)
            } catch (error) {
                setIsLoading(false)
                console.error(error)
                const errorCode = error.code
            }
        }
    }

    const handleDltUser = async (e) => {
        e.preventDefault()
        // console.log(`Deleting user with ID: ${documentId}`)
        setIsLoading(true)

        // const docRef = doc(firestore, 'users', documentId)
        const docRef = doc(firestore, 'accessGrantedUsers', documentId)

        try {
            await deleteDoc(docRef)
            setDocumentId(null)
            // console.log('Document successfully deleted!')
        } catch (error) {
            console.error('Error deleting document: ', error)
        }
        setIsLoading(false)
        setIsDltOpen(false)
    }

    const filteredQ = query(
        accessGrantedUsers,
        where('restricted', '==', false),
        orderBy('email')
    )

    useEffect(() => {
        const unsubscribe = onSnapshot(filteredQ, (snapshot) => {
            const usersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setUsers(usersData)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const currentUserId = user.id
    const currentUserEmail = user.email

    return (
        <>
            <Breadcrumbs />
            <div className="container px-4 py-5">
                <div className="mb-4 flex flex-wrap">
                    <div className="ml-auto">
                        <button
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2  text-sm font-medium text-white shadow-sm transition-all duration-100   ease-in hover:bg-indigo-700  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700"
                            onClick={(e) => {
                                openAddModal()
                            }}
                        >
                            Add New User
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto rounded-lg bg-white p-4">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold text-slate-500"
                                >
                                    E-mail
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-center font-semibold text-slate-500"
                                >
                                    Role
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-center font-semibold text-slate-500"
                                >
                                    Account Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-center font-semibold text-slate-500"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr className="" key={user.id}>
                                        <td className="px-4 py-3">
                                            {user.email}
                                            {currentUserEmail === user.email &&
                                                ' (You)'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <p className="capitalize">
                                                {user.role}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusPill email={user.email} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {currentUserEmail !==
                                                user.email && (
                                                <div className="flex justify-center gap-x-2">
                                                    <ResetBtn
                                                        email={user.email}
                                                    />
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        className="rounded bg-green-200/50 p-2 text-green-600 transition-all duration-100 ease-in hover:bg-green-200 disabled:bg-gray-200 disabled:text-gray-600"
                                                        onClick={(e) => {
                                                            openEditModal(
                                                                user.email
                                                            )
                                                        }}
                                                    >
                                                        <FaPen />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        className="rounded bg-red-200/50 p-2 text-red-600 transition-all duration-100 ease-in hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-600"
                                                        onClick={(e) => {
                                                            openDltModal(
                                                                user.id
                                                            )
                                                        }}
                                                    >
                                                        <FaTrashCan />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="grid min-h-[100px] place-items-center font-medium text-slate-500/50">
                                            No user records to show
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* modals */}
            <>
                {/* add new user */}
                <Transition appear show={isAddOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[9999]"
                        // onClose={closeEditModal}
                        onClose={() => {}}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Add User
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form
                                                autoComplete="off"
                                                onSubmit={handleAddUser}
                                            >
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="role"
                                                        className="form-label mb-2 text-sm font-medium text-slate-700"
                                                    >
                                                        Role
                                                    </label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        className="form-input"
                                                        value={formData.role}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        <option value="choose">
                                                            Choose the role
                                                        </option>
                                                        {data.roles.map(
                                                            (role, index) => (
                                                                <option
                                                                    value={
                                                                        role?.value
                                                                    }
                                                                    key={`role-${index}`}
                                                                >
                                                                    {role?.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.role && (
                                                        <span className="helper-text error-mssg text-sm font-medium">
                                                            {errors.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="email"
                                                        className="form-label mb-2 text-sm font-medium text-slate-700"
                                                    >
                                                        E-mail
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="form-input"
                                                        placeholder="E-mail"
                                                        autoComplete="off"
                                                        value={formData.email}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    {errors.email && (
                                                        <span className="helper-text error-mssg text-sm font-medium">
                                                            {errors.email}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-7 flex flex-wrap-reverse gap-3 lg:flex-wrap">
                                                    <button
                                                        type="button"
                                                        className="flex w-full flex-1 justify-center rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 shadow-sm transition-all duration-100  ease-in hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
                                                        onClick={closeAddModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex w-full flex-1 justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2  text-sm font-medium text-white shadow-sm transition-all duration-100 ease-in hover:bg-indigo-700  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700"
                                                    >
                                                        {isLoading
                                                            ? 'Adding...'
                                                            : 'Add'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <EditModal
                    isOpen={isEditOpen}
                    onClose={closeEditModal}
                    // onConfirm={handleEditUser}
                    email={documentId}
                />
                <DeleteModal
                    isOpen={isDltOpen}
                    message={
                        'This action cannot be undone. All settings associated with this user will be lost.'
                    }
                    onClose={closeDltModal}
                    onConfirm={handleDltUser}
                    state={isLoading}
                />
            </>
        </>
    )
}

export default UserSettings
