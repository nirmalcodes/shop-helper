import React from 'react'

const UpdatesCard = ({ data }) => {
    const { title, timeStamp, message } = data

    return (
        <>
            <div className="rounded-md border bg-white p-4 shadow-md">
                <h5 className="text-lg font-semibold leading-none text-slate-700">
                    {title ? title : '-'}
                </h5>
                <span className="mb-2 inline-block text-sm font-medium text-slate-600/50">
                    {timeStamp ? timeStamp : '-'}
                </span>
                <p className="w-full md:w-[85%] lg:w-[80%] xl:w-[65%]">
                    {message ? message : '-'}
                </p>
            </div>
        </>
    )
}

export default UpdatesCard
