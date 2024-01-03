import React, { useEffect, useRef } from 'react'

const NumberInput = ({ ...rest }) => {
    const inputRef = useRef(null)

    useEffect(() => {
        const input = inputRef.current

        const handleWheel = (event) => {
            event.preventDefault()
        }

        input.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            input.removeEventListener('wheel', handleWheel)
        }
    }, [])

    return <input type="number" inputMode="numeric" ref={inputRef} {...rest} />
}
export default NumberInput
