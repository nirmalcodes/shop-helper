import React from 'react'
import { Modal, UpdatesCard } from '../../components'
import { FaPlus } from 'react-icons/fa6'

const UpdatesPage = () => {
    return (
        <>
            <div className="container">
                <div className="relative flex flex-wrap gap-y-4">
                    <div className="w-full lg:w-7/12 lg:px-4">
                        <div className="flex flex-col gap-y-3">
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                className="fixed bottom-4 right-4 z-[999] flex h-[56px] w-[56px] items-center justify-center rounded-full border border-transparent bg-indigo-600 p-4 font-medium text-white shadow-md hover:bg-indigo-700  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-700 md:bottom-5"
            >
                <FaPlus className="text-4xl" />
            </button>
            <Modal title={'Add New Update'}/>
        </>
    )
}

export default UpdatesPage
