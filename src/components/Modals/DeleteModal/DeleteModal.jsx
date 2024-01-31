import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FaTriangleExclamation } from 'react-icons/fa6'

const DeleteModal = ({ isOpen, onClose, onConfirm, state }) => {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[9999]"
                    onClose={onClose}
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
                                        <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-200/50 p-1">
                                            <FaTriangleExclamation className="text-lg text-red-600" />
                                        </div>
                                        <h3 className="mb-2 text-center text-lg font-medium leading-6 text-gray-900">
                                            Are you sure?
                                        </h3>
                                        <p className="text-center">
                                            This action cannot be undone. All
                                            settings associated with this user
                                            will be lost.
                                        </p>
                                        <div className="mt-7 flex gap-3">
                                            <button
                                                type="button"
                                                className="flex w-full justify-center rounded-lg border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all duration-100  ease-in hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex w-full justify-center rounded-lg border border-transparent  bg-red-500 px-4 py-2 text-sm font-medium text-white   shadow-sm transition-all  duration-100 ease-in hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:bg-red-700"
                                                onClick={onConfirm}
                                            >
                                                {state
                                                    ? 'Deleting...'
                                                    : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default DeleteModal
