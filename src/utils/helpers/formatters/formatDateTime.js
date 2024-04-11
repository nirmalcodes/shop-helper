import { format } from 'date-fns'

export const formatDateTime = (
    timestamp,
    formatString = 'dd/MM/yyyy hh:mm:ss aa'
) => {
    let formattedDate
    if (isNaN(timestamp)) {
        formattedDate = null
    } else {
        // Convert timestamp to a Date object
        const date = new Date(timestamp * 1000)

        // Format the date using date-fns
        formattedDate = format(date, formatString)

        // console.log(formattedDate)
    }

    return formattedDate
}
