import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaPlus, FaPaperPlane } from 'react-icons/fa6'
import { auth, firestore, storage } from '../../services/firebase/firebase'
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from '@firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage'
import imageCompression from 'browser-image-compression'
import { AutoResizeTextarea, UpdateCard } from '../../components'

const UpdatesPage = () => {
    const containerRef = useRef(null)

    const [isHeight, setIsHeight] = useState(false)
    const [formData, setFormData] = useState({
        message: '',
        fileAttachments: [],
    })
    const [updates, setUpdates] = useState([])

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
        const maxSize = 8
        const files = Array.from(e.target.files)

        console.log('Selected Files: ', files)

        // Validate file size
        const validFiles = files.filter(
            (file) => file.size <= maxSize * 1024 * 1024
        ) // 4 MB

        if (validFiles.length !== files.length) {
            alert(`Some files exceed the ${maxSize}MB limit.`)
        }

        setFormData({ ...formData, fileAttachments: validFiles })
    }

    const handleImageUpload = async (imageFile) => {
        // Check if the image exceeds 4MB
        if (imageFile.size > 4 * 1024 * 1024) {
            // Compress the image
            const compressedImage = await compressImage(imageFile)
            return compressedImage
        } else {
            // If the image is already below 4MB, return the original image
            return imageFile
        }
    }

    const compressImage = async (imageFile) => {
        const options = {
            maxSizeMB: 1, // Set your desired max size in MB
            maxWidthOrHeight: 1920, // Set your desired max width or height
        }

        try {
            const compressedFile = await imageCompression(imageFile, options)
            return compressedFile
        } catch (error) {
            console.error('Error compressing image:', error)
            return null
        }
    }

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
            // await updateDoc(docRef, { docID: docRef.id })

            console.log('Document written with ID: ', docRef.id)

            let attachmentURLs = []

            if (formData.fileAttachments.length > 0) {
                for (const file of formData.fileAttachments) {
                    if (file.type.startsWith('image')) {
                        const compressedFile = await compressImage(file)
                        const storageRef = ref(
                            storage,
                            `updates/${docRef.id}/${compressedFile.name}`
                        )
                        await uploadBytes(storageRef, compressedFile)
                        const downloadURL = await getDownloadURL(storageRef)
                        attachmentURLs.push(downloadURL)
                    } else {
                        const storageRef = ref(
                            storage,
                            `updates/${docRef.id}/${file.name}`
                        )
                        await uploadBytes(storageRef, file)
                        const downloadURL = await getDownloadURL(storageRef)
                        attachmentURLs.push(downloadURL)
                    }
                }
            }

            // Updated the added doc with URLs for attached files
            await updateDoc(docRef, { fileAttachments: attachmentURLs })

            // Clear form data
            setFormData({ message: '', fileAttachments: [] })

            // alert('Update message sent successfully!')
        } catch (error) {
            console.error('Error sending message:', error)
            // alert('An error occurred while sending the message.')
        }
    }

    // Function to fetch all documents from the "updates" collection
    const fetchUpdates = async () => {
        try {
            // "desc" For descending order
            // "asc" For ascending order
            const q = query(updatesCollectionRef, orderBy('createdAt', 'asc'))

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
        fetchUpdates()
    }, [])

    return (
        <>
            <div
                className="scroll-area container relative mb-16 flex-1 overflow-hidden overflow-y-auto scroll-smooth bg-green-300/0 px-4 py-5"
                ref={containerRef}
            >
                {isHeight &&
                    updates.map((updateDoc) => (
                        <UpdateCard key={updateDoc?.id} update={updateDoc} />
                    ))}
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
                    <AutoResizeTextarea
                        onChange={handleMessageChange}
                        value={formData.message}
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
