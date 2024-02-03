import React, { useEffect, useRef, useState } from 'react'
import { auth, firestore } from '../../services/firebase/firebase'
import { doc, getDoc } from '@firebase/firestore'
import { formatDateTime } from '../../utils/helpers/formatters/formatDateTime'

const UpdateCard = ({ update }) => {
    const { createdBy, message, createdAt } = update
    const UpdateRef = useRef(null)
    const [docData, setDocData] = useState({})

    const fetchUsername = async (userId) => {
        const userDocRef = doc(firestore, 'users', userId)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
            setDocData({ ...docSnap.data() })
        }
    }

    useEffect(() => {
        fetchUsername(createdBy)
        UpdateRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [update])

    return (
        <div className="flex items-end bg-yellow-300/0" ref={UpdateRef}>
            <div
                className={`mb-2 flex w-fit max-w-[80%] flex-col rounded-md p-2 shadow lg:max-w-[55%]${
                    auth.currentUser.uid === update?.createdBy
                        ? ' ml-auto rounded-br-none bg-green-200'
                        : ' rounded-tl-none bg-white'
                }`}
            >
                <p className="mb-[2px] text-xs font-medium text-gray-500">
                    {docData.username ?? '-'}
                </p>
                <p className="text-sm">{message}</p>
                {/* <p className="mb-[2px] text-sm">{message}</p> */}
                {/* <span className="ml-auto inline-block text-[0.6875rem]">
                    {formatDateTime(createdAt?.seconds) ?? '-'}
                </span> */}
            </div>
        </div>
    )
}

export default UpdateCard
