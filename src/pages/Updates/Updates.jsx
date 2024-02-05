import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { firestore, storage } from '../../services/firebase/firebase'
import {
    FaCamera,
    FaPaperPlane,
    FaRegTrashCan,
    FaRegComments,
    FaCloudArrowUp,
} from 'react-icons/fa6'
import { AutoResizeTextarea, MessageCard } from '../../components'
import imageCompression from 'browser-image-compression'
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from '@firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage'

const randomImage = () => {
    const randomNumber = Math.floor(Math.random() * 100)
    // console.log('rand numb: ', randomNumber)
    const imgUrl = `https://picsum.photos/1280/720?random=${randomNumber}`
    // console.log('random url: ', imgUrl)
    return imgUrl
}

const messagesD = [
    {
        date: '03/02/2024',
        messages: [
            {
                id: 1,
                message:
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos quas, beatae id sit tempore, autem ut voluptatem corporis esse cupiditate omnis. Illum odio, facere explicabo odit incidunt porro ratione ea!',
                attachment: [],
                createdBy: 'user',
                createdAt: '15:53:23 PM',
            },
        ],
    },
]

export const PreviewTumbnails = ({ data = [] }) => {
    return <></>
}

const Updates = () => {
    const { user } = useContext(AuthContext)

    const msgContRef = useRef(null)
    const fileInputRef = useRef(null)

    const [isHeightDone, setIsHeightDone] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [images, setImages] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    useLayoutEffect(() => {
        const msgContEl = msgContRef.current

        if (msgContEl) {
            const rect = msgContEl.getBoundingClientRect()

            const height = parseFloat(rect.height)

            if (height) {
                msgContEl.style.maxHeight = `${height}px`
            }

            setIsHeightDone(true)
        }

        return () => {}
    }, [])

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const handleImageChange = (e) => {
        const maxSize = 6
        const maxAttachments = 4

        const selectedFiles = Array.from(e.target.files)
        const newImages = []

        for (const file of selectedFiles) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Only images are allowed.')
                return
            }

            if (file.size > maxSize * 1024 * 1024) {
                setErrorMessage(
                    `File "${file.name}" is too large (maximum file size is ${maxSize}MB).`
                )
                return
            }

            if (images.length + newImages.length >= 4) {
                setErrorMessage(`Maximum ${maxAttachments} images allowed.`)
                return
            }

            newImages.push(file)
        }

        setImages([...images, ...newImages])
        setErrorMessage('')
    }

    const handleImageRemove = (index) => {
        setImages([...images.slice(0, index), ...images.slice(index + 1)])
        fileInputRef.current.value = ''
    }

    const compressImage = async (imageFile) => {
        const options = {
            maxSizeMB: 1, // Set max size you want in MB
            maxWidthOrHeight: 1920, // Set max width or height you want
        }

        try {
            const compressedFile = await imageCompression(imageFile, options)
            return compressedFile
        } catch (error) {
            console.error('Error compressing image:', error)
            return null
        }
    }

    const messagesCollectionRef = collection(firestore, 'messages')
    const orderedQuery = query(
        messagesCollectionRef,
        orderBy('createdAt', 'asc')
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Add message to the messages collection
            const docRef = await addDoc(messagesCollectionRef, {
                message: message,
                attachments: [],
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            })

            // Handle attachments upload
            let attachmentURLs = []

            if (images.length > 0) {
                for (const file of images) {
                    const compressedFile = await compressImage(file)
                    const storageRef = ref(
                        storage,
                        `messages/${docRef.id}/${compressedFile.name}`
                    )
                    await uploadBytes(storageRef, compressedFile)
                    const downloadURL = await getDownloadURL(storageRef)
                    attachmentURLs.push(downloadURL)
                }
            }

            // Updated the added doc with URLs for attached files
            await updateDoc(docRef, { attachments: attachmentURLs })

            // Clear form
            setMessage('')
            setImages([])
        } catch (error) {
            console.error('Error sending message:', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setMessages(messagesData)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            <div
                className="relative mb-[64px] flex flex-[1_1_0] flex-col gap-4 overflow-hidden overflow-y-auto bg-gradient-to-br from-sky-200 via-sky-100 to-sky-50 px-4 py-3"
                ref={msgContRef}
            >
                {isHeightDone &&
                    (messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message?.id}
                                userID={message?.createdBy}
                                message={message?.message}
                                attachments={message?.attachments}
                                timestamp={message?.createdAt?.seconds}
                            />
                        ))
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
                            <FaRegComments className="text-7xl" />
                            <p className="text-lg">
                                Looks like messages are empty.
                            </p>
                        </div>
                    ))}
            </div>
            {/* inputs */}
            <div className="absolute inset-x-0 bottom-0 z-50 border-t bg-white">
                {/* previews */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-1 border-b bg-red-300/0 px-3 py-2">
                        {images.map((image, index) => (
                            <div
                                className="relative aspect-square h-[100px] max-w-[100dvh] overflow-hidden rounded md:h-[120px] xl:h-[150px]"
                                key={index}
                            >
                                <button
                                    type="button"
                                    className="absolute inset-0 flex items-center justify-center bg-black/15 text-3xl text-white transition-colors duration-150 ease-in hover:bg-black/25"
                                    onClick={() => handleImageRemove(index)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-bounce">
                                            <FaCloudArrowUp className="animate-pulse" />
                                        </div>
                                    ) : (
                                        <FaRegTrashCan />
                                    )}
                                </button>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
                                    loading="lazy"
                                    className="h-full w-full bg-gradient-to-tr from-gray-500 to-gray-100 object-cover object-left-top"
                                />
                            </div>
                        ))}
                    </div>
                )}
                {errorMessage && (
                    <span className="px-3 text-sm text-red-600">
                        {errorMessage}
                    </span>
                )}

                {/* form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-[64px] w-full flex-1 items-end px-2 py-3 md:px-4"
                >
                    {/* attachment input */}
                    <div>
                        <label
                            htmlFor="attachFiles"
                            className={`flex h-[36px] w-[36px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-slate-400/10 md:h-[40px] md:w-[40px]`}
                        >
                            <FaCamera className="text-xl md:text-2xl" />
                        </label>
                        <input
                            type="file"
                            id="attachFiles"
                            ref={fileInputRef}
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {/* text input */}
                    <div className="mx-[6px] flex flex-1 items-end md:mx-3">
                        <AutoResizeTextarea
                            id="message"
                            placeholder="Message"
                            value={message}
                            onChange={handleMessageChange}
                        />
                    </div>
                    {/* send btn */}
                    <div>
                        <button
                            type="submit"
                            disabled={
                                message === '' && images.length === 0 && true
                            }
                            className="flex h-[36px] w-[36px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-slate-400/10 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent md:h-[40px] md:w-[40px]"
                        >
                            <FaPaperPlane className="text-xl md:text-2xl" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Updates
