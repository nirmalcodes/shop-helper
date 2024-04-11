export const getBoundings = (element) => {
    // const element = elementRef.current

    if (element) {
        const rect = element.getBoundingClientRect()

        const elementWidth = parseFloat(rect.width)
        const elementHeight = parseFloat(rect.height)

        const fixedWidth = elementWidth.toFixed(2)
        const fixedHeight = elementHeight.toFixed(2)

        const finalWidth = parseFloat(fixedWidth)
        const finalHeight = parseFloat(fixedHeight)

        return {
            width: finalWidth,
            height: finalHeight,
        }
    }
}
