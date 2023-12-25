import React, { useState } from 'react'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="relative">
                <Sidebar open={isOpen} />
                <Navbar toggleOpen={setIsOpen} />
                <main className="content">{children}</main>
            </div>
        </>
    )
}

export default Layout
