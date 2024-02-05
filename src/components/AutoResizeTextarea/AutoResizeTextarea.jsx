import React, { useEffect, useRef } from 'react'

const AutoResizeTextarea = ({
    id,
    onChange,
    value,
    maxHeight = 160,
    className,
    placeholder = '',
}) => {
    const textareaRef = useRef(null)

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
                textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
        }
    }

    useEffect(() => {
        autoResize()
    }, [value])

    return (
        <textarea
            id={id}
            ref={textareaRef}
            rows="1"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            style={{ maxHeight: `${maxHeight}px` }}
            className={`scroll-area m-0 w-full resize-none rounded-md border-none bg-slate-400/10 outline-none focus:ring-0 ${className}`}
        />
    )
}

export default AutoResizeTextarea
