import React, { useState } from "react"
import Settings from "../Settings.js"

export const EventContext = React.createContext()

export const EventProvider = (props) => {
    const [events, setEvents] = useState([])

    const getEvents = () => {
        return fetch(`${Settings.apiHost}/events`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(response => response.json())
            .then(setEvents)
    }

    const joinEvent = eventId => {
        return fetch(`${Settings.apiHost}/events/${eventId}/signup`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(getEvents)
    }

    const leaveEvent = eventId => {
        return fetch(`${Settings.apiHost}/events/${eventId}/signup`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(getEvents)
    }

    const createEvent = event => {
        return fetch(`${Settings.apiHost}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            },
            body: JSON.stringify(event)
        })
            .then(response => response.json())
            .then(getEvents)
    }


    return (
        <EventContext.Provider value={{
            joinEvent,
            events,
            getEvents,
            createEvent,
            leaveEvent
        }} >
            { props.children}
        </EventContext.Provider>
    )
}