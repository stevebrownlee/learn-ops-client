import React, { useState } from 'react';
import Settings from '../Settings.js';
import { fetchIt } from '../utils/Fetch.js';
import { useContext } from 'react';
import { CohortContext } from '../cohorts/CohortProvider.js';
import { useEffect } from 'react';

export const CohortEventList = () => {
    const [cohortEvents, setEvents] = useState({});
    const { activeCohort } = useContext(CohortContext);

    const fetchCohortEvents = () => {
        // Fetch events for the active cohort
        fetchIt(`${Settings.apiHost}/events?cohort=${activeCohort}`)
            .then(data => {
                // Filter out events from today to 7 days in the future
                const today = new Date();
                const sevenDaysFromNow = new Date();
                sevenDaysFromNow.setDate(today.getDate() + 7);
                const filteredEvents = data.filter(event => {
                    const eventDate = new Date(event.event_datetime);
                    return eventDate >= today && eventDate <= sevenDaysFromNow;
                });
                setEvents(filteredEvents);
            })
            .catch(error => console.error('Error fetching events:', error));
    }

    useEffect(() => {
        if (activeCohort) {
            fetchCohortEvents();
        }
    }
    , [activeCohort]);



    return (
        <div style={{ flex: "1 1 0", fontSize: "0.8rem" }} className="cohort-event-list">
            {cohortEvents.length > 0 ? (
                <ul>
                    {cohortEvents.map((event, index) => (
                        <li key={index} onClick={() => { }}>
                            <strong>{event.event_name}</strong> - {new Date(event.event_datetime).toLocaleDateString()}
                            <p>{event.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming events.</p>
            )}
        </div>
    );
}