import React, { useEffect, useRef } from 'react'

const NumberInput = ({
    id,
    label = 'Label',
    placeholder = 'Enter Number',
    errorMssg = '',
    ...rest
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
            <label
                htmlFor={id}
                className={
                    'mb-2 block flex-[1] text-sm font-medium text-slate-700 md:inline-block'
                }
            >
                {label}
            </label>
            <input
                type="number"
                inputMode="numeric"
                id={id}
                name={id}
                placeholder={placeholder}
                className="h-min w-full appearance-none rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 disabled:bg-gray-300/30 disabled:text-gray-600 md:w-fit md:flex-[2]"
                autoComplete="off"
                ref={inputRef}
                {...rest}
            />
            {errorMssg && (
                <span
                    name={id}
                    className="inline-block text-sm font-medium text-red-500"
                >
                    helper text
                </span>
            )}
        </>
    )
}
export default NumberInput
