import React, { useLayoutEffect, useRef, useState } from 'react'
import { getBoundings } from '../../utils/helpers/getBoundings'

const SettingsPage = () => {
    const menuRef = useRef(null)
    const contentRef = useRef(null)

    const [isStyled, setIsStyled] = useState(false)

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

    const tabs = [1, 2, 3]
    return (
        <div className="relative flex flex-1">
            <div
                className="w-[240px] border-r bg-white px-4 py-2"
                ref={menuRef}
            >
                <ul className="">
                    {tabs.map((tab, index) => (
                        <li className="" key={`tab-${index + 1}`}>
                            {`Tab ${index + 1}`}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1" ref={contentRef}>
                SettingsPage-Content
            </div>
        </div>
    )
}

export default SettingsPage
