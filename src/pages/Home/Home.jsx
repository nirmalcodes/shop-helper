import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { FaCalculator } from 'react-icons/fa6'
import { StatCard } from '../../components'
import { firestore } from '../../services/firebase/firebase'
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
} from '@firebase/firestore'
import { formatDateTime } from '../../utils/helpers/formatters/formatDateTime'

const Home = () => {
    const { user, logOut } = useContext(AuthContext)
    const [latestMessage, setLatestMessage] = useState(
        localStorage.getItem('lastMessageId')
            ? localStorage.getItem('lastMessageId')
            : null
    )
    const [statCard, setStatCard] = useState({
        name: 'KOKO Calc Mode',
        value: '-',
        icon: FaCalculator,
    })
    const [updates, setUpdates] = useState([])

    const kokoConfigurationsRef = doc(
        firestore,
        'kokoConfigurations',
        'configData'
    )
    const updatesRef = collection(firestore, 'messages')
    const q = query(updatesRef, orderBy('createdAt', 'desc'), limit(5))
    const notiQ = query(updatesRef, orderBy('createdAt', 'desc'), limit(1))

    useEffect(() => {
        const unsubKokoConfig = onSnapshot(kokoConfigurationsRef, (doc) => {
            const { discountMode } = doc.data()
            setStatCard((prevData) => ({
                ...prevData,
                value: discountMode ? 'Discount' : 'Default',
            }))
        })

        const unsubUpdates = onSnapshot(q, (snapshot) => {
            const updatesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setUpdates(updatesData)
        })

        const unsubscribe = onSnapshot(notiQ, (snapshot) => {
            const newMessage = snapshot.docs[0]
            if (newMessage && newMessage.id !== latestMessage) {
                const messageData = newMessage.data()
                showNotification(
                    'New Message!',
                    messageData.message ?? 'You have new message.'
                )
                setLatestMessage(newMessage.id)
                localStorage.setItem('lastMessageId', newMessage.id)
            }
        })

        return () => {
            unsubKokoConfig()
            unsubUpdates()
            unsubscribe()
        }
    }, [])

    function showNotification(title, message) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: 'android-chrome-192x192.png',
            })
        } else {
            console.error('Notification permission denied')
        }
    }

    return (
        <>
            <section className="container px-4 py-5">
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <StatCard data={statCard} />
                </div>
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <div className="w-full rounded-lg bg-white p-4 shadow-md">
                        <h3 className="mb-2 text-xl font-bold text-indigo-600">
                            Recent Updates
                        </h3>
                        <hr className="border-t-2" />
                        <div className="flex flex-col divide-y">
                            {updates && updates.length > 0 ? (
                                updates.map((update) => {
                                    let timestamp = update?.createdAt?.seconds
                                    return (
                                        <div
                                            className="px-2 py-4"
                                            key={update?.id}
                                        >
                                            <p className="text-lg">
                                                {update?.message}
                                            </p>
                                            {/* <span className="inline-block text-xs text-slate-400">
                                                {formatDateTime(timestamp)}
                                            </span> */}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="grid min-h-[100px] place-items-center font-medium text-slate-500/50">
                                    No Updates to show
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
