import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { FaCalculator } from 'react-icons/fa6'
import { StatCard, UpdateCard } from '../../components'
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
} from '@firebase/firestore'
import { firestore } from '../../services/firebase/firebase'

const HomePage = () => {
    const { user, logOut } = useContext(AuthContext)
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

    const updatesCollectionRef = collection(firestore, 'updates')
    // Function to fetch all documents from the "updates" collection
    const fetchUpdates = async () => {
        try {
            // "desc" For descending order
            // "asc" For ascending order
            const q = query(
                updatesCollectionRef,
                orderBy('createdAt', 'desc'),
                limit(5)
            )

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const updatesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setUpdates(updatesData)
            })

            // Clean up the listener when the component unmounts
            return () => unsubscribe()
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    useEffect(() => {
        const unsub = onSnapshot(kokoConfigurationsRef, (doc) => {
            // console.log('Current data: ', doc.data())
            const { discountMode } = doc.data()
            setStatCard((prevData) => ({
                ...prevData,
                value: discountMode ? 'Discount' : 'Default',
            }))
        })
        fetchUpdates()
        return () => {
            unsub()
        }
    }, [])

    console.log(updates)

    return (
        <>
            <section className="container px-4 py-5">
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <StatCard data={statCard} />
                </div>
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <div className="w-full rounded-lg bg-white p-4 shadow-md">
                        <h3 className="mb-4 text-xl font-bold text-indigo-600">
                            Recent Updates
                        </h3>
                        <hr />
                        <div className="flex flex-col gap-y-4 py-5">
                            {updates && updates.length > 0 ? (
                                updates.map((update) => (
                                    <UpdateCard data={update} key={update.id} />
                                ))
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

export default HomePage
