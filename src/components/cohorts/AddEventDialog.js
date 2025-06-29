import React, { useState, useContext } from 'react'
import Settings from '../Settings.js'
import { fetchIt } from '../utils/Fetch.js'
import { Dialog, Button, TextField, TextArea, Text, Flex, Card, DropdownMenu } from '@radix-ui/themes'
import { CohortContext } from './CohortProvider'


export const AddEventDialog = ({
    selectedDates, setSelectedDates, showAddDialog,
    setShowAddDialog, selectedDate, eventTypes, fetchCohortEvents
}) => {
    const [eventName, setEventName] = useState('')
    const [eventTime, setEventTime] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [selectedEventType, setSelectedEventType] = useState(null)

    const { activeCohortDetails, activeCohort } = useContext(CohortContext)

    // Handle adding a new event
    const handleAddEvent = () => {
        if ((!selectedDate && selectedDates.length === 0) || !eventName || !selectedEventType) return

        // Determine which dates to create events for
        const datesToProcess = selectedDates.length > 0 ? selectedDates : [selectedDate]

        // Create and post events for each selected date
        const createPromises = datesToProcess.map(date => {
            // API is expecting a single datetime string, so we format it accordingly
            const eventDate = new Date(date)
            eventDate.setHours(0, 0, 0, 0) // Set time to midnight for consistency
            const eventTimeParts = eventTime.split(':')
            if (eventTimeParts.length === 2) {
                eventDate.setHours(parseInt(eventTimeParts[0], 10), parseInt(eventTimeParts[1], 10))
            }

            // Create a date string that preserves the local time
            // Format: YYYY-MM-DDTHH:MM:SS.sssZ
            // First, adjust for timezone offset so when converted to ISO it will be the correct local time
            const tzOffset = eventDate.getTimezoneOffset() * 60000 // offset in milliseconds
            const localISOTime = new Date(eventDate.getTime() - tzOffset).toISOString()

            const newEvent = {
                cohort: activeCohortDetails.id,
                datetime: localISOTime,
                name: eventName,
                type: selectedEventType.id,
                description: eventDescription
            }

            // POST the new event to the API
            return fetchIt(`${Settings.apiHost}/events?cohort=${activeCohortDetails.id}`, {
                method: 'POST',
                body: JSON.stringify(newEvent),
                token: activeCohortDetails.token
            })
        })

        // Wait for all events to be created
        Promise.all(createPromises)
            .then(fetchCohortEvents)
            .catch(error => console.error('Error adding events:', error))

        // Reset form and selection
        setEventName('')
        setEventTime('')
        setEventDescription('')
        setSelectedEventType(null)
        setSelectedDates([])
        setShowAddDialog(false)
    }

    return (
        <Dialog.Root open={showAddDialog} onOpenChange={(open) => {

            if (!open) {
                // Reset selection when dialog is closed
                setSelectedDates([])
            }
        }}>
            <Dialog.Content>
                <Dialog.Title>Add Event</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    {selectedDates.length > 1
                        ? `Add an event for ${selectedDates[0].toLocaleDateString()} to ${selectedDates[selectedDates.length - 1].toLocaleDateString()} (${selectedDates.length} days)`
                        : selectedDate && `Add an event for ${selectedDate.toLocaleDateString()}`}
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Event Name
                        </Text>
                        <TextField.Input
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Enter event name"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Time
                        </Text>
                        <TextField.Input
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Event Type
                        </Text>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button variant="soft" color={selectedEventType ? "gray" : "gray"} style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Flex align="center" gap="2">
                                        {selectedEventType && (
                                            <div className="event-type-indicator" style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: selectedEventType.color
                                            }}></div>
                                        )}
                                        <span>{selectedEventType ? selectedEventType.description : 'Select event type'}</span>
                                    </Flex>
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                {eventTypes.map((type) => (
                                    <DropdownMenu.Item
                                        key={type.id}
                                        onClick={() => setSelectedEventType(type)}
                                    >
                                        <Flex align="center" gap="2">
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: type.color
                                            }}></div>
                                            <span>{type.description}</span>
                                        </Flex>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Description
                        </Text>
                        <TextArea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Enter event description"
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button onClick={handleAddEvent}>
                        Add Event
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root >
    )
}