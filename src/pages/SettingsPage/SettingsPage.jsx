import React, { useLayoutEffect, useRef, useState } from 'react'
import { getBoundings } from '../../utils/helpers/getBoundings'

const SettingsPage = () => {
    const menuRef = useRef(null)
    const contentRef = useRef(null)

    const [isStyled, setIsStyled] = useState(false)
    const [activeTab, setactiveTab] = useState(1)

    useLayoutEffect(() => {
        const menuElement = menuRef.current
        const contentElement = contentRef.current

        if (menuElement && contentElement) {
            const menuElementBoundings = getBoundings(menuElement)
            const contentlementBoundings = getBoundings(contentElement)

            const menuHeight = menuElementBoundings.height
            const contentHeight = contentlementBoundings.height

            if (menuHeight && contentHeight) {
                if (menuHeight === contentHeight) {
                    menuElement.style.maxHeight = `${menuHeight}px`
                    contentElement.style.maxHeight = `${contentHeight}px`
                }
            }
        }

        setIsStyled(true)

        return () => {}
    }, [])

    const tabs = [
        { id: 1, name: 'User Settings' },
        { id: 2, name: 'KOKO Settings' },
        { id: 3, name: 'Updates Settings' },
    ]

    const handleTabs = (index) => {
        setactiveTab(index)
    }

    return (
        <div className="relative flex flex-1 flex-col md:flex-row">
            <div
                className="scroll-area flex w-full max-w-[100vw] gap-2 overflow-hidden overflow-x-auto border-r bg-white px-3 py-3 md:max-w-[auto] md:flex-col md:gap-3 md:overflow-y-auto lg:w-[240px]"
                ref={menuRef}
            >
                {isStyled &&
                    tabs.map((tab) => (
                        <button
                            type="button"
                            className={`w-full text-nowrap rounded-md border px-4 py-2 text-left md:text-wrap ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100/50'
                            }`}
                            onClick={(e) => handleTabs(tab.id)}
                            key={tab?.name}
                        >
                            {tab?.name}
                        </button>
                    ))}
            </div>
            <div className="flex-1" ref={contentRef}>
                {isStyled &&
                    tabs.map((tab) => (
                        <div
                            className={`px-4 py-5 ${
                                activeTab === tab.id ? 'block' : 'hidden'
                            }`}
                            key={`pannel-${tab.name}`}
                        >
                            {tab?.name}
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default SettingsPage
