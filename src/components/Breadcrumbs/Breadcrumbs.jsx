import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const transformText = (inputText) => {
    // Replace underscores with spaces
    let withoutUnderscores = inputText.replace(/_/g, ' ')

    // Capitalize the first letter of each word
    let capitalizedText = withoutUnderscores.replace(/\b\w/g, (match) =>
        match.toUpperCase()
    )

    return capitalizedText
}

const Breadcrumbs = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/')
    // const filteredPathnames = pathnames.filter((pathname) => pathname.length > 0)
    const filteredPathnames = pathnames.filter((crumb) => crumb !== '')

    let currentLink = ''

    const crumbs = filteredPathnames.map((crumb, index) => {
        currentLink += `/${crumb}`

        return (
            <li
                className={`mr-2 inline-block after:ml-2 after:content-['/'] last:after:hidden ${
                    index + 1 === filteredPathnames.length
                        ? ''
                        : 'text-slate-500/80'
                }`}
                key={index}
            >
                {index + 1 === filteredPathnames.length ? (
                    <p>{transformText(crumb)}</p>
                ) : (
                    <Link to={currentLink} className="hover:underline">
                        {transformText(crumb)}
                    </Link>
                )}
            </li>
        )
    })

    return (
        <>
            <nav aria-label="breadcrumb" className="px-4 py-3 bg-white border-b">
                <ul className="inline-block">{crumbs}</ul>
            </nav>
        </>
    )
}

export default Breadcrumbs
