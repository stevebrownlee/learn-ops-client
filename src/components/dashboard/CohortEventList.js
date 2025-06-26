import React, { useState, useContext, useEffect } from 'react'
import Settings from '../Settings.js'
import { fetchIt } from '../utils/Fetch.js'
import { CohortContext } from '../cohorts/CohortProvider.js'
import simpleAuth from '../auth/simpleAuth.js'
import { Card, Flex, Text, Heading } from '@radix-ui/themes'

export const CohortEventList = () => {
    const [cohortEvents, setEvents] = useState({})
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { getCurrentUser, getProfile } = simpleAuth()

    const fetchCohortEvents = (cohortId) => {
        // Fetch events for the active cohort
        fetchIt(`${Settings.apiHost}/events?cohort=${cohortId}`)
            .then(data => {
                // Filter out events from today to 7 days in the future
                const today = new Date("2022-11-01")
                // const today = new Date()
                const sevenDaysFromNow = new Date()
                sevenDaysFromNow.setDate(today.getDate() + 7)
                const filteredEvents = data.filter(event => {
                    const eventDate = new Date(event.event_datetime)
                    return eventDate >= today && eventDate <= sevenDaysFromNow
                })
                setEvents(filteredEvents)
            })
            .catch(error => console.error('Error fetching events:', error))
    }

    useEffect(() => {
        const user = getCurrentUser()
        let cohortId = 0

        if (user && user.profile && user.profile.current_cohort) {
            cohortId = user.profile.current_cohort.id
        }
        else if (!activeCohort) {
            cohortId = user.profile.person.active_cohort
            activateCohort(cohortId)
        }
        fetchCohortEvents(cohortId)

    }, [])



    return (
        <div style={{ flex: "1 1 0" }} className="cohort-event-list">
            {cohortEvents.length > 0 ? (<>
                <Heading size="4" mb="2">Upcoming Events</Heading>
                <Flex direction="column" gap="2">
                    {cohortEvents.map((event, index) => (
                        <Card size="2" key={index} onClick={() => { }} style={{ cursor: 'pointer', backgroundColor: `${event.event_type.color}` }}>
                            <Flex direction="column" gap="1">
                                <Flex justify="between" align="center">
                                    <Text weight="bold">{event.event_name}</Text>
                                    <Text size="2" color="gray">{new Date(event.event_datetime).toLocaleDateString()}</Text>
                                </Flex>
                                <Text size="2">{event.description}</Text>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </>) : (
                <Text>No upcoming events.</Text>
            )}
        </div>
    )
}