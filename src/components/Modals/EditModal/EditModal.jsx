import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { data } from '../../../utils/constants'
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from '@firebase/firestore'
import { firestore } from '../../../services/firebase/firebase'

const EditModal = ({ isOpen, onClose, email }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        role: 'choose',
    })
    const [errors, setErrors] = useState({
        email: '',
        role: '',
    })

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

    const [userDocIDs, setuserDocIDs] = useState([])

    useEffect(() => {
        const findUserDocs = async () => {
            try {
                const aGUsers = collection(firestore, 'accessGrantedUsers')
                const usersRef = collection(firestore, 'users')

                const queryAGUs = query(aGUsers, where('email', '==', email))
                const queryUs = query(usersRef, where('email', '==', email))

                const aGUsSnapshot = await getDocs(queryAGUs)
                const usersSnapshot = await getDocs(queryUs)

                let userIDArray = []

                aGUsSnapshot.forEach((doc) => {
                    userIDArray.push(doc.id)
                    const docData = doc.data()

                    setFormData({
                        email: docData?.email,
                        role: docData?.role,
                    })
                })

                usersSnapshot.forEach((doc) => {
                    userIDArray.push(doc.id)
                })

                setuserDocIDs([...userDocIDs, ...userIDArray])
            } catch (error) {
                console.error(error)
            }
        }

        findUserDocs()
        return () => {}
    }, [email])

    // console.log(userDocIDs)

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleEditUser = async (e) => {
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

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsLoading(false)
        } else {
            try {
                const aGUsRef = doc(
                    firestore,
                    'accessGrantedUsers',
                    userDocIDs[0]
                )
                const usersRef = doc(firestore, 'users', userDocIDs[1])
                // console.log('new role ', formData.role)
                await updateDoc(aGUsRef, { role: formData.role })
                await updateDoc(usersRef, { role: formData.role })
                // console.log('Document successfully edited!')
            } catch (error) {
                console.error('Error editing document: ', error)
            }
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
                                    Edit User
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form onSubmit={handleEditUser}>
                                        <div className="form-group">
                                            <label
                                                htmlFor="role"
                                                className="form-label mb-2 text-sm font-medium text-slate-700"
                                            >
                                                Role
                                            </label>
                                            <select
                                                name="role"
                                                id="role"
                                                className="form-input"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                            >
                                                <option value="choose">
                                                    Choose the role
                                                </option>
                                                {data.roles.map(
                                                    (role, index) => (
                                                        <option
                                                            value={role?.value}
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
                                                disabled
                                                value={formData.email}
                                                onChange={handleInputChange}
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
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex w-full flex-1 justify-center rounded-lg border border-transparent  bg-green-500 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-green-700"
                                            >
                                                {isLoading
                                                    ? 'Updating...'
                                                    : 'Update'}
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
    )
}

export default EditModal
