import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { FaCalculator, FaUser } from 'react-icons/fa6'
import { StatCard } from '../../components'
import { firestore } from '../../services/firebase/firebase'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from '@firebase/firestore'
import { Helmet } from 'react-helmet-async'

const Home = () => {
    const { user } = useContext(AuthContext)

    const [localUsername, setLocalUsername] = useState(
        localStorage.getItem('tempUserData')
            ? JSON.parse(localStorage.getItem('tempUserData')).username
            : ''
    )
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(
        localStorage.getItem('tempUserData')
            ? JSON.parse(localStorage.getItem('tempUserData')).firstTimeUser
            : false
    )

    const createUserDoc = async (e) => {
        const currentUID = user.uid

        const accessGrantedUsers = collection(firestore, 'accessGrantedUsers')
        const usersCollectionRef = collection(firestore, 'users')

        const rolesQuery = query(
            accessGrantedUsers,
            where('email', '==', user.email)
        )
        const rolesSnapshot = await getDocs(rolesQuery)

        if (!rolesSnapshot.empty) {
            let docData
            rolesSnapshot.forEach((doc) => {
                docData = {
                    id: doc.id,
                    ...doc.data(),
                }
                return docData
            })

            const docRef = doc(usersCollectionRef, currentUID)

            await setDoc(docRef, {
                username: localUsername,
                email: user.email,
                role: docData.role,
                createdBy: docData.createdBy,
                createdAt: serverTimestamp(),
                restricted: docData.restricted,
            })

            localStorage.removeItem('tempUserData')
        }

        window.location.reload()
    }

    useEffect(() => {
        if (isFirstTimeUser) {
            createUserDoc()
        }
    }, [isFirstTimeUser])

    const [kokoStatCard, setKokoStatCard] = useState({
        name: 'KOKO Calc Mode',
        value: '-',
        icon: FaCalculator,
    })
    const [usersStatCard, setUsersStatCard] = useState({
        name: 'Users Count',
        value: '-',
        icon: FaUser,
    })

    const [messages, setMessages] = useState([])
    const [userRole, setUserRole] = useState(null)

    const kokoConfigurationsRef = doc(
        firestore,
        'kokoConfigurations',
        'configData'
    )
    const messagesRef = collection(firestore, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(5))

    useEffect(() => {
        const getUserRole = async () => {
            try {
                const currentUser = user.uid
                const docRef = doc(firestore, 'users', currentUser)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const role = docSnap.data().role
                    // console.log(role)
                    setUserRole(role)
                }
            } catch (error) {
                console.log(error)
            }
        }
        const getUserCount = async () => {
            let maxUsersLimit

            const siteConfigs = doc(
                firestore,
                'siteConfigurations',
                'configData'
            )
            const docSnap = await getDoc(siteConfigs)

            if (docSnap.exists()) {
                maxUsersLimit = docSnap.data().maxUsers
            }

            const accessGrantedUsers = collection(
                firestore,
                'accessGrantedUsers'
            )
            const currentUsers = await getDocs(accessGrantedUsers)
            const count = currentUsers.size

            const userCount = `${count - 1} / ${maxUsersLimit - 1}`
            // currentUsersCount = count
            setUsersStatCard((prevData) => ({
                ...prevData,
                value: userCount,
            }))
        }

        const unsubKokoConfig = onSnapshot(kokoConfigurationsRef, (doc) => {
            const { discountMode } = doc.data()
            setKokoStatCard((prevData) => ({
                ...prevData,
                value: discountMode ? 'Discount' : 'Default',
            }))
        })

        const unsubMessages = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setMessages(messagesData)
        })

        getUserRole()
        getUserCount()
        return () => {
            unsubKokoConfig()
            unsubMessages()
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Shop Helper | Home</title>
            </Helmet>
            <section className="container px-4 py-5">
                <div className="mb-5 flex flex-row flex-wrap items-center gap-4">
                    <StatCard data={kokoStatCard} />
                    {(userRole == 'root' || userRole == 'admin') && (
                        <StatCard data={usersStatCard} />
                    )}
                </div>
                {/* <div className="mb-5 flex flex-row flex-wrap items-center">
                    <div className="w-full rounded-lg bg-white p-4 shadow-md">
                        <h3 className="mb-2 text-xl font-bold text-indigo-600">
                            Recent messages
                        </h3>
                        <hr className="border-t-2" />
                        <div className="flex flex-col divide-y">
                            {messages && messages.length > 0 ? (
                                messages.map((update) => {
                                    let timestamp = update?.createdAt?.seconds
                                    return (
                                        <div
                                            className="px-2 py-4"
                                            key={update?.id}
                                        >
                                            <p className="text-lg">
                                                {update?.message}
                                            </p>
                                            <span className="inline-block text-xs text-slate-400">
                                                {formatDateTime(timestamp)}
                                            </span>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="grid min-h-[100px] place-items-center font-medium text-slate-500/50">
                                    No messages to show
                                </div>
                            )}
                        </div>
                    </div>
                </div> */}
            </section>
        </>
    )
}

export default Home
