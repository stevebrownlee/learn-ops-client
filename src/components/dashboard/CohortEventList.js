import React, { useState, useContext, useEffect } from 'react'
import Settings from '../Settings.js'
import { fetchIt } from '../utils/Fetch.js'
import { CohortContext } from '../cohorts/CohortProvider.js'
import simpleAuth from '../auth/simpleAuth.js'
import { Card, Flex, Text, Heading, Button } from '@radix-ui/themes'

export const CohortEventList = () => {
    const [cohortEvents, setEvents] = useState({})
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { getCurrentUser, getProfile } = simpleAuth()

    const fetchCohortEvents = (cohortId) => {
        // Fetch events for the active cohort
        fetchIt(`${Settings.apiHost}/events?cohort=${cohortId}`)
            .then(data => {
                // Filter out events from today to 14 days in the future
                const today = new Date()
                // normalize today's time to 00:00:00
                today.setHours(0, 0, 0, 0)

                // const today = new Date("2022-07-05")
                const fourteenDaysFromNow = new Date(today)
                fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14)
                fourteenDaysFromNow.setHours(0, 0, 0, 0)

                const filteredEvents = data.filter(event => {
                    const eventDate = new Date(event.event_datetime)
                    // normalize event time to 00:00:00 so only the date is compared
                    eventDate.setHours(0, 0, 0, 0)

                    const isFutureEvent = eventDate >= today
                    const isWithinTwoWeeks = eventDate <= fourteenDaysFromNow
                    const isVisible = isFutureEvent && isWithinTwoWeeks
                    return isVisible
                }).slice(0, 8)
                setEvents(filteredEvents.sort((a, b) => new Date(b.event_datetime) - new Date(a.event_datetime)))
            })
            .catch(error => console.error('Error fetching events:', error))
    }

    useEffect(() => {
        const user = getCurrentUser()
        let cohortId = 0

        if (activeCohort && activeCohort > 0) {
            cohortId = activeCohort
        }
        else if (user && user.profile && user.profile.current_cohort) {
            cohortId = user.profile.current_cohort.id
            activateCohort(cohortId)
        }
        else if (!activeCohort) {
            cohortId = user.profile.person.active_cohort
            activateCohort(cohortId)
        }
        fetchCohortEvents(cohortId)

    }, [activeCohort])



    return (
        <div style={{ flex: "1 1 0" }} className="cohort-event-list">
            <Heading size="4" mb="2">⏰ Upcoming Events</Heading>
            {cohortEvents.length > 0 ? (<>
                <Flex direction="column" gap="2">
                    {cohortEvents.map((event, index) => (
                        <Card size="2" key={index} onClick={() => { }} style={{ cursor: 'pointer', backgroundColor: `${event.event_type.color}` }}>
                            <Flex direction="column" gap="1">
                                <Flex justify="between" align="center">
                                    <Text size="1"weight="bold">{event.event_name}</Text>
                                    <Text size="1" color="gray">{new Date(event.event_datetime).toLocaleDateString()}</Text>
                                </Flex>
                                <Text size="1">{event.description}</Text>
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