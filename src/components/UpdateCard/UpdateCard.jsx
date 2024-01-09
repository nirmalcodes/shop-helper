import React, { useEffect, useRef } from 'react'
import { auth } from '../../services/firebase/firebase'

const UpdateCard = ({ update }) => {
    const UpdateRef = useRef(null)

    useEffect(() => {
        UpdateRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [update])

    return (
        <div className="flex items-end bg-yellow-300/0" ref={UpdateRef}>
            <div
                className={`mb-2 flex w-fit max-w-[80%] flex-col rounded-md p-2 shadow-md lg:max-w-[55%]${
                    auth.currentUser.uid === update?.createdBy
                        ? ' ml-auto bg-green-200'
                        : ' bg-white'
                }`}
            >
                <p className="mb-[2px] text-xs font-medium">
                    {update?.createdBy}
                </p>
                <p className="mb-[2px] text-sm">{update?.message}</p>
                <span className="ml-auto inline-block text-[0.6875rem]">
                    {update?.createdAt?.seconds}
                </span>
            </div>
        </div>
    )
}

export default UpdateCard
