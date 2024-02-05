import React, { useContext, useEffect, useRef, useState } from 'react'
import { formatDateTime } from '../../utils/helpers/formatters/formatDateTime'
import { doc, getDoc } from '@firebase/firestore'
import { firestore } from '../../services/firebase/firebase'
import { AuthContext } from '../../contexts/AuthContext'

const MessageCard = ({ userID, message, timestamp, attachments = [] }) => {
    const { user } = useContext(AuthContext)
    const messageRef = useRef(null)
    const [username, setUsername] = useState(null)
    const [own, setOwn] = useState(false)

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const docRef = doc(firestore, 'users', userID)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setUsername(docSnap.data().username)
                }
            } catch (error) {
                console.error('Error fetching username:', error)
            }
        }

        if (userID === user.uid) {
            setOwn(true)
        }

        fetchUsername()

        messageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [user])

    return (
        <>
            {/* row */}
            <div className="flex" ref={messageRef}>
                {/* message */}
                <div className={`mssg-card${own ? ' ml-auto' : ' mr-auto'}`}>
                    {/* message text*/}
                    <div
                        className={`mssg-txt-card${
                            own
                                ? ' ml-auto rounded-tr-none bg-green-200'
                                : ' rounded-tl-none bg-white'
                        }`}
                    >
                        <div className="flex">
                            <div className="name text-sm font-medium">
                                {username ?? '-'}
                            </div>
                        </div>
                        <p className="message">{message ?? '-'}</p>
                        <span className="date-time ml-6 block text-right text-xs">
                            {formatDateTime(timestamp) ?? '-'}
                        </span>
                    </div>
                    {/* attachments */}
                    {attachments.length > 0 && (
                        <div
                            className={`mssg-attachment-card${
                                own ? ' bg-green-200' : ' bg-white'
                            }`}
                        >
                            {attachments.map((attachment, index) => (
                                <div
                                    className="attachment-thumbnail"
                                    key={`img-${index + 1}`}
                                >
                                    <img
                                        src={attachment}
                                        alt="img"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MessageCard
