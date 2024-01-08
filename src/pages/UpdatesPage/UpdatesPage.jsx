import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Modal, UpdatesCard } from '../../components'
import { FaPlus, FaPaperPlane } from 'react-icons/fa6'
import { auth, firestore, storage } from '../../services/firebase/firebase'
import {
    addDoc,
    arrayUnion,
    collection,
    serverTimestamp,
    updateDoc,
} from '@firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage'

const UpdatesPage = () => {
    const containerRef = useRef(null)
    const textareaRef = useRef(null)

    const [isHeight, setIsHeight] = useState(false)
    const [formData, setFormData] = useState({
        message: '',
        fileAttachments: [],
    })

    useLayoutEffect(() => {
        const containerEl = containerRef.current

        if (containerEl) {
            const rect = containerEl.getBoundingClientRect()

            const height = parseFloat(rect.height)

            if (height) {
                containerEl.style.maxHeight = `${height}px`
            }

            setIsHeight(true)
        }

        return () => {}
    }, [])

    const handleMessageChange = (e) => {
        setFormData({ ...formData, message: e.target.value })
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)

        console.log('Selected Files: ', files)

        // Validate file size
        const validFiles = files.filter((file) => file.size <= 4 * 1024 * 1024) // 4 MB

        if (validFiles.length !== files.length) {
            alert('Some files exceed the 4MB limit.')
        }

        setFormData({ ...formData, fileAttachments: validFiles })
    }

    const autoResize = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`

            const maxHeight = parseInt(
                window.getComputedStyle(textarea).maxHeight,
                10
            )
            textarea.style.overflowY =
                textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
        }
    }

    useEffect(() => {
        autoResize()
    }, [formData.message])

    const updatesCollectionRef = collection(firestore, 'updates')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Get current user id

            let userId

            if (auth.currentUser) {
                userId = auth.currentUser.uid
            }
            console.log('Creating Update by Current User: ', userId)

            const docData = {
                createdAt: serverTimestamp(),
                createdBy: userId,
                message: formData.message,
            }

            // Add update to the updates collection
            const docRef = await addDoc(updatesCollectionRef, docData)

            // Update the added doc with the docID field
            await updateDoc(docRef, { docID: docRef.id })

            // Clear form data
            setFormData({ message: '', fileAttachments: [] })

            console.log('Document written with ID: ', docRef.id)

            let attachmentURLs = []

            if (formData.fileAttachments.length > 0) {
                for (const file of formData.fileAttachments) {
                    const storageRef = ref(
                        storage,
                        `updates/${docRef.id}/${file.name}`
                    )
                    await uploadBytes(storageRef, file)
                    const downloadURL = await getDownloadURL(storageRef)
                    attachmentURLs.push(downloadURL)
                }
            }

            // Updated the added doc with URLs for attached files
            await updateDoc(docRef, { fileAttachments: attachmentURLs })

            alert('Update message sent successfully!')
        } catch (error) {
            console.error('Error sending message:', error)
            alert('An error occurred while sending the message.')
        }
    }

    return (
        <>
            <div
                className="scroll-area container relative flex-1 overflow-hidden overflow-y-auto scroll-smooth pb-[60px]"
                ref={containerRef}
            >
                <div className="w-full lg:w-7/12 lg:px-4 ">
                    {isHeight && (
                        <div className="flex flex-col gap-y-3">
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                            <UpdatesCard data={''} />
                        </div>
                    )}
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="absolute inset-x-0 bottom-0 z-50 flex min-h-[64px] items-end border-t bg-white px-2 py-3 md:px-4"
            >
                <div className="hidden">
                    <label
                        htmlFor="attachFiles"
                        className="flex h-[36px] w-[36px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-slate-400/10 md:h-[40px] md:w-[40px]"
                    >
                        <FaPlus className="text-xl md:text-2xl" />
                    </label>
                    <input
                        type="file"
                        name="attachFiles"
                        id="attachFiles"
                        className="hidden"
                        accept="image/*,.pdf,.docx"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <div className="mx-[6px] flex flex-1 items-end md:mx-3">
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        onChange={handleMessageChange}
                        value={formData.message}
                        style={{ maxHeight: '160px' }}
                        className="scroll-area m-0 w-full resize-none rounded-md border-none bg-slate-400/10 outline-none focus:ring-0"
                    />
                </div>
                <div>
                    <button
                        disabled={
                            formData.fileAttachments.length === 0 &&
                            formData.message === ''
                                ? true
                                : false
                        }
                        type="submit"
                        // onClick={addNewUpdate}
                        className="flex h-[36px] w-[36px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-slate-400/10 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent md:h-[40px] md:w-[40px]"
                    >
                        <FaPaperPlane className="text-xl md:text-2xl" />
                    </button>
                </div>
            </form>
        </>
    )
}

export default UpdatesPage
