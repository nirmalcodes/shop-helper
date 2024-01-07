import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Modal, UpdatesCard } from '../../components'
import { FaPlus, FaPaperPlane } from 'react-icons/fa6'
import { auth, firestore } from '../../services/firebase/firebase'
import { addDoc, collection, updateDoc } from '@firebase/firestore'

const UpdatesPage = () => {
    const containerRef = useRef(null)
    const textareaRef = useRef(null)

    const [isHeight, setIsHeight] = useState(false)
    const [inputValue, setInputValue] = useState('')

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
                textarea.scrollHeight > maxHeight ? 'scroll' : 'hidden'
        }
    }

    useEffect(() => {
        autoResize()
    }, [inputValue])

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const updatesCollectionRef = collection(firestore, 'updates')

    const addNewUpdate = async () => {
        try {
            // Get current user id
            const user = auth.currentUser
            let userId
            if (user) {
                userId = user.uid
            }
            // Add the document
            const docRef = await addDoc(updatesCollectionRef, {
                message: '',
                fileAttachments: [],
                createdAt: null,
                createdBy: userId,
            })
            // Retrieve the document ID from the added document
            const docId = docRef.id

            // Update the added document with the docID field
            await updateDoc(docRef, { docID: docId })
            console.log('Document written with ID: ', docRef.id)
        } catch (error) {
            console.error('Error adding document: ', error)
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
            <div className="absolute inset-x-0 bottom-0 flex min-h-[64px] items-end border-t bg-white px-2 py-3 md:px-4">
                <div>
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
                    />
                </div>
                <div className="mx-[6px] flex flex-1 items-end md:mx-3">
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        onChange={handleInputChange}
                        value={inputValue}
                        style={{ maxHeight: '160px' }}
                        className="scroll-area m-0 w-full resize-none rounded-md border-none bg-slate-400/10 outline-none focus:ring-0"
                    />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={addNewUpdate}
                        className="flex h-[36px] w-[36px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-slate-400/10 md:h-[40px] md:w-[40px]"
                    >
                        <FaPaperPlane className="text-xl md:text-2xl" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default UpdatesPage
