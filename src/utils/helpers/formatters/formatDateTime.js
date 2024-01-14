import { format } from 'date-fns'

export const formatDateTime = (
    timestampInSeconds,
    formatString = 'dd/MM/yyyy HH:mm:ss aa'
) => {
    // Sample timestamp in seconds
    // const timestampInSeconds = 1705182377

    // Convert timestamp to a Date object
    const date = new Date(timestampInSeconds * 1000)

    // Format the date using date-fns
    // const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss aa')
    const formattedDate = format(date, formatString)

    // console.log(formattedDate)

    return formattedDate
}
