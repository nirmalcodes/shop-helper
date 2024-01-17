import React, { Fragment, useState } from 'react'
import { Breadcrumbs } from '../../components'
import {
    FaTrashCan,
    FaPen,
    FaTriangleExclamation,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa6'
import { Dialog, Transition } from '@headlessui/react'
import { data } from '../../utils/constants'

const users = [
    {
        id: 1,
        username: 'Trevor',
        email: 'trevor@sizsub.lc',
        role: 'Admin',
    },
    {
        id: 2,
        username: 'Owen',
        email: 'owen@pi.na',
        role: 'Moderator',
    },
    {
        id: 3,
        username: 'Travis',
        email: 'travis@pivib.il',
        role: 'User',
    },
]

const UserSettings = () => {
    const [isAddOpen, setIsAddOpen] = useState(true)
    const [isToggled, setIstoggled] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDltOpen, setIsDltOpen] = useState(false)

    const togglePassword = () => {
        setIstoggled((prev) => !prev)
    }

    const closeAddModal = () => {
        setIsAddOpen(false)
    }
    const closeEditModal = () => {
        setIsEditOpen(false)
    }
    const closeDltModal = () => {
        setIsDltOpen(false)
    }

    const openAddModal = () => {
        setIsAddOpen(true)
    }
    const openEditModal = (userId) => {
        setIsEditOpen(true)
        console.log('Open edit for user id', userId)
    }
    const openDltModal = (userId) => {
        setIsDltOpen(true)
        console.log('Open dlt for user id', userId)
    }

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
                                    Username
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold text-slate-500"
                                >
                                    E-mail
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold text-slate-500"
                                >
                                    Role
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold text-slate-500"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => {
                                return (
                                    <tr className="" key={user.username}>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">
                                                {user.username}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.role}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-x-2">
                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    className="rounded bg-green-200/50 p-2 transition-all duration-100 ease-in hover:bg-green-200"
                                                    onClick={(e) => {
                                                        openEditModal(user.id)
                                                    }}
                                                >
                                                    <FaPen className="text-green-600" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    className="rounded bg-red-200/50 p-2 transition-all duration-100 ease-in hover:bg-red-200"
                                                    onClick={(e) => {
                                                        openDltModal(user.id)
                                                    }}
                                                >
                                                    <FaTrashCan className="text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
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
                                            Edit User
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form autoComplete="off">
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
                                                    >
                                                        <option value={'0'}>
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
                                                </div>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="username"
                                                        className="form-label mb-2 text-sm font-medium text-slate-700"
                                                    >
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        className="form-input"
                                                        placeholder="Username"
                                                        autoComplete="off"
                                                    />
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
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="password"
                                                        className="form-label mb-2 text-sm font-medium text-slate-700"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                isToggled
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            name="password"
                                                            id="password"
                                                            placeholder="********"
                                                            className="form-input"
                                                            autoComplete="off"
                                                            // value={
                                                            //     formData.password
                                                            // }
                                                            // onChange={
                                                            //     handleChange
                                                            // }
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                togglePassword
                                                            }
                                                            className={
                                                                'absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-700/60 transition-all duration-150 hover:bg-slate-400/40'
                                                            }
                                                        >
                                                            {isToggled ? (
                                                                <FaEyeSlash />
                                                            ) : (
                                                                <FaEye />
                                                            )}
                                                        </button>
                                                    </div>
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
                                                        Add
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

                {/* edit modal */}
                <Transition appear show={isEditOpen} as={Fragment}>
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
                                            Edit User
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form>
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
                                                    >
                                                        <option value={'0'}>
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
                                                </div>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="username"
                                                        className="form-label mb-2 text-sm font-medium text-slate-700"
                                                    >
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        className="form-input"
                                                        placeholder="Username"
                                                        disabled
                                                    />
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
                                                        disabled
                                                    />
                                                </div>
                                                <div className="mt-7 flex flex-wrap-reverse gap-3 lg:flex-wrap">
                                                    <button
                                                        type="button"
                                                        className="flex w-full flex-1 justify-center rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 shadow-sm transition-all duration-100  ease-in hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
                                                        onClick={closeEditModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex w-full flex-1 justify-center rounded-lg border border-transparent  bg-green-500 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-green-700"
                                                    >
                                                        Update
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

                {/* dlt modal */}
                <Transition appear show={isDltOpen} as={Fragment}>
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
                                        <div className="mt-2">
                                            <form>
                                                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-200/50 p-1">
                                                    <FaTriangleExclamation className="text-lg text-red-600" />
                                                </div>
                                                <h3 className="mb-2 text-center text-lg font-medium leading-6 text-gray-900">
                                                    Are you sure?
                                                </h3>
                                                <p className="text-center">
                                                    This action cannot be
                                                    undone. All settings
                                                    associated with this user
                                                    will be lost.
                                                </p>
                                                <div className="mt-7 flex gap-3">
                                                    <button
                                                        type="button"
                                                        className="flex w-full justify-center rounded-lg border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all duration-100  ease-in hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                                                        onClick={closeDltModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex w-full justify-center rounded-lg border border-transparent  bg-red-500 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:bg-red-700"
                                                    >
                                                        Delete User
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
            </>
        </>
    )
}

export default UserSettings
