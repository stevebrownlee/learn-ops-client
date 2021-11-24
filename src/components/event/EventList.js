import React, { useContext, useEffect } from "react"
import { HumanDate } from "../utils/HumanDate.js"
import { EventContext } from "./EventProvider.js"
import { useHistory } from "react-router-dom";
import "./Events.css"

export const EventList = () => {
    const history = useHistory()
    const { events, getEvents, joinEvent, leaveEvent } = useContext(EventContext)

    useEffect(() => {
        getEvents()
    }, [])

    return (
        <article className="events">
            <header className="events__header">
                <h1>Level Up Game Events</h1>

                <div className="tab-bar radius">
                    <a className="tab" href="#" data-text="Well attended">
                        <span className="icon">👩‍👩‍👧</span>
                    </a>
                    <a className="tab" href="#" data-text="Coming soon">
                        <span className="icon">⏱</span>
                    </a>
                    <a className="tab" href="#" data-text="Skill level">
                        <span className="icon">🎯</span>
                    </a>
                </div>

                <button className="btn btn-2 btn-sep icon-create"
                    onClick={() => {
                        history.push({ pathname: "/events/new" })
                    }}
                >Schedule New Event</button>
            </header>
            {
                events.map(event => {
                    return <section key={event.id} className="registration">
                        <div className="registration__game">{event.game.title}</div>
                        <div>Organized by: {event.organizer.full_name}</div>
                        <div>{event.description}</div>
                        <div>
                            <HumanDate date={event.date} /> @ {event.time}
                        </div>
                        {
                            event.owner
                                ? ""
                                : event.joined
                                    ? <button className="btn btn-3"
                                        onClick={() => leaveEvent(event.id)}
                                    >Leave</button>
                                    : <button className="btn btn-2"
                                        onClick={() => joinEvent(event.id)}
                                    >Join</button>
                        }
                    </section>
                })
            }
        </article >
    )
}