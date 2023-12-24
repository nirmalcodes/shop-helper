import React, { useEffect, useRef } from 'react'

const NumberInput = ({
    id,
    label = 'Label',
    placeholder = '0000.00',
    errorMssg = false,
}) => {
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

    return (
        <>
            <div className="form-group">
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
                <input
                    type="number"
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    className="form-input"
                    autoComplete="off"
                    ref={inputRef}
                />
                {errorMssg && (
                    <span name={id} className="">
                        helper text
                    </span>
                )}
            </div>
        </>
    )
}
export default NumberInput
