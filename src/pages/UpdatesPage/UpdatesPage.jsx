import React from 'react'
import { UpdatesCard } from '../../components'

const UpdatesPage = () => {
    return (
        <>
            <div className="container">
                <div className="flex flex-wrap gap-y-4">
                    <div className="w-full lg:w-7/12 lg:px-4">
                        <div className="h-[calc(100vh_-_230px)] max-h-[calc(100vh_-_230px)] overflow-hidden overflow-y-auto rounded-lg bg-white px-4 py-5 shadow-md">
                            news
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                        </div>
                    </div>
                    <div className="w-full lg:w-5/12 lg:px-4">
                        <form className="rounded-lg bg-white px-4 py-5 shadow-md">
                            hello there
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdatesPage
