import React, { useEffect, useRef } from 'react'

const NumberInput = ({ ...rest }) => {
    const inputRef = useRef(null)

    useEffect(() => {
        const input = inputRef.current

        const handleWheel = (event) => {
            event.preventDefault()
        }

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault()
            }
        }

        input.addEventListener('wheel', handleWheel, { passive: false })
        input.addEventListener('keydown', handleKeyDown)

        return () => {
            input.removeEventListener('wheel', handleWheel)
            input.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return <input type="number" inputMode="numeric" ref={inputRef} {...rest} />
}
export default NumberInput
