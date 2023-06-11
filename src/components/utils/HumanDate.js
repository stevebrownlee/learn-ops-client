export const HumanDate = ({ date, weekday=false, shortMonth=false }) => {
    let options = {}
    if (weekday) {
        options = {
            weekday: 'long',
            year: 'numeric',
            month: shortMonth ? 'short' : 'long',
            day: 'numeric',
            timeZone: 'America/Chicago'
        }
    }
    else {
        options = {
            year: 'numeric',
            month: shortMonth ? 'short' : 'long',
            day: 'numeric',
            timeZone: 'America/Chicago'
        }
    }

    //eslint-disable-next-line
    return new Date(date.replace(/-/g, '\/')).toLocaleDateString("en-US",options)
}
