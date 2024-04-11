import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

import { firestore, storage } from '../../services/firebase/firebase'
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from '@firebase/firestore'
import { deleteObject, listAll, ref } from '@firebase/storage'

import { formatDateTime } from '../../utils/helpers/formatters/formatDateTime'
import { FaEllipsisVertical, FaRegTrashCan } from 'react-icons/fa6'
import DeleteModal from '../Modals/DeleteModal/DeleteModal'
import { Menu, Transition } from '@headlessui/react'
import SliderModal from '../Modals/SliderModal/SliderModal'

const MessageCard = ({
    createdBy,
    messageId,
    message,
    timestamp,
    attachments = [],
}) => {
    const { user } = useContext(AuthContext)

    const messageRef = useRef(null)

    const [userRole, setUserRole] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDltOpen, setIsDltOpen] = useState(false)

    const [username, setUsername] = useState(null)
    const [own, setOwn] = useState(false)

    const [documentId, setDocumentId] = useState(null)

    const [isSliderOpen, setIsSliderOpen] = useState(false)
    const [activeSlideNo, setActiveSlideNo] = useState(null)

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const usersRef = collection(firestore, 'users')
                const rolesQuery = query(
                    usersRef,
                    where('email', '==', createdBy)
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
                    setUsername(docData.username)
                    setUserRole(docData.role)
                }
            } catch (error) {
                console.error('Error fetching username:', error)
            }
        }

        if (createdBy === user.email) {
            setOwn(true)
        }

        fetchUsername()

        messageRef.current?.scrollIntoView({ behavior: 'smooth' })
        return () => {}
    }, [])

    const openDltModal = (id) => {
        setDocumentId(id)
        setIsDltOpen(true)
    }
    const closeDltModal = () => {
        setDocumentId(null)
        setIsDltOpen(false)
    }

    const deleteFiles = (listResult) => {
        listResult.items.forEach((itemRef) => {
            if (
                itemRef.fullPath.endsWith('.jpg') ||
                itemRef.fullPath.endsWith('. jpeg') ||
                itemRef.fullPath.endsWith('.png') ||
                itemRef.fullPath.endsWith('.webp')
            ) {
                deleteObject(itemRef)
                    .then(() => {
                        // console.log(`File ${itemRef.name} deleted`)
                    })
                    .catch((error) => {
                        // console.error(error)
                    })
            } else {
                listAll(itemRef)
                    .then((subResult) => {
                        deleteFiles(subResult)
                    })
                    .catch((error) => {
                        // console.error(error)
                    })
            }
        })
    }

    const handleDltMssg = async (e) => {
        e.preventDefault()
        // console.log(`Deleting user with ID: ${documentId}`)
        setIsLoading(true)

        try {
            const docRef = doc(firestore, 'messages', documentId)
            const folderRef = ref(storage, `messages/${documentId}`)

            await deleteDoc(docRef)

            await listAll(folderRef)
                .then((result) => deleteFiles(result))
                .then(() => {
                    // console.log('Folder and its contents deleted successfully!')
                })

            setDocumentId(null)
            // console.log('Document successfully deleted!')
        } catch (error) {
            // console.error('Error deleting document: ', error)
        }
        setIsLoading(false)
        setIsDltOpen(false)
    }

    const openSlider = (number) => {
        setActiveSlideNo(number)
        setIsSliderOpen(true)
    }
    const closeSlider = () => {
        setActiveSlideNo(null)
        setIsSliderOpen(false)
    }

    return (
        <>
            {/* row */}
            <div className="flex" ref={messageRef}>
                {/* message */}
                <div className={`mssg-card${own ? ' ml-auto' : ' mr-auto'}`}>
                    {/* message text*/}
                    {message.trim().length !== 0 && (
                        <div
                            className={`mssg-txt-card${
                                own
                                    ? ' ml-auto rounded-tr-none bg-green-200'
                                    : ' mr-auto rounded-tl-none bg-white'
                            }`}
                        >
                            <div className="flex">
                                <div className="name text-[13px] font-medium">
                                    {username ?? '-'}
                                </div>
                                {own && userRole != 'user' && (
                                    <div className="ml-auto leading-none">
                                        {/* dropdown */}
                                        <Menu
                                            as="div"
                                            className="relative inline-block text-left"
                                        >
                                            <div>
                                                <Menu.Button className="inline-flex justify-center text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent">
                                                    <FaEllipsisVertical />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                    <div className="px-1 py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    className={`font-medium ${
                                                                        active
                                                                            ? ' bg-black/5 text-gray-900'
                                                                            : ' text-gray-900'
                                                                    } group flex w-full items-center rounded-md px-2 py-2`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        openDltModal(
                                                                            messageId
                                                                        )
                                                                    }}
                                                                >
                                                                    <FaRegTrashCan className="mr-1" />
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                )}
                            </div>
                            <p className="message mr-6 text-[15px]">
                                {message ?? '-'}
                            </p>
                            <span className="date-time ml-6 block text-right text-[10px]">
                                {formatDateTime(timestamp) ?? '-'}
                            </span>
                        </div>
                    )}
                    {/* attachments */}
                    {attachments.length > 0 && (
                        <>
                            <div
                                className={`mssg-attachment-card${
                                    own
                                        ? ' ml-auto bg-green-200'
                                        : ' mr-auto bg-white'
                                }`}
                            >
                                {message.trim().length === 0 && (
                                    <div className="flex px-1">
                                        <div className="name pb-[2px] text-[13px] font-medium">
                                            {username ?? '-'}
                                        </div>
                                        {own && userRole != 'user' && (
                                            <div className="ml-auto leading-none">
                                                {/* dropdown */}
                                                <Menu
                                                    as="div"
                                                    className="relative inline-block text-left"
                                                >
                                                    <div>
                                                        <Menu.Button className="inline-flex justify-center text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent">
                                                            <FaEllipsisVertical />
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                            <div className="px-1 py-1">
                                                                <Menu.Item>
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <button
                                                                            className={`font-medium ${
                                                                                active
                                                                                    ? ' bg-black/5 text-gray-900'
                                                                                    : ' text-gray-900'
                                                                            } group flex w-full items-center rounded-md px-2 py-2`}
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                openDltModal(
                                                                                    messageId
                                                                                )
                                                                            }}
                                                                        >
                                                                            <FaRegTrashCan className="mr-1" />
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="attachment-wrapper">
                                    {attachments.map((attachment, index) => (
                                        <div
                                            className="attachment-thumbnail"
                                            key={`img-${index}`}
                                            onClick={() => {
                                                openSlider(index)
                                            }}
                                        >
                                            <img
                                                src={attachment?.url}
                                                alt={attachment?.name}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {message.trim().length === 0 && (
                                    <span className="date-time ml-6 block pt-[2px] text-right text-[10px]">
                                        {formatDateTime(timestamp) ?? '-'}
                                    </span>
                                )}
                            </div>
                            {isSliderOpen && (
                                <SliderModal
                                    activeSlide={activeSlideNo}
                                    onClose={closeSlider}
                                    files={attachments}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* modal */}
            <DeleteModal
                isOpen={isDltOpen}
                message={'This action cannot be undone. All data will be lost.'}
                onClose={closeDltModal}
                onConfirm={handleDltMssg}
                state={isLoading}
            />
        </>
    )
}

export default MessageCard
