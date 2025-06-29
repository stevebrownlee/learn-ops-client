import React, { useContext, useState, useEffect, useRef } from 'react'
import { Dialog, Button, TextField, TextArea, Text, Flex, Card, DropdownMenu } from '@radix-ui/themes'
import Settings from '../Settings.js'
import simpleAuth from '../auth/simpleAuth.js'
import { CohortContext } from './CohortProvider'
import { AddEventDialog } from './AddEventDialog.js'
import { fetchIt } from '../utils/Fetch.js'
import './CohortCalendar.css'

export const CohortCalendar = () => {
  const { activeCohortDetails, activeCohort, getCohort } = useContext(CohortContext)
  const [events, setEvents] = useState({})
  const [eventTypes, setEventTypes] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [calendarDays, setCalendarDays] = useState([])
  const [calendarMonths, setCalendarMonths] = useState([])
  const clickTimeoutRef = useRef(null)
  const isDoubleClickRef = useRef(false)

  // Drag selection state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartDate, setDragStartDate] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])
  const [mouseDownActive, setMouseDownActive] = useState(false)

  const { isAuthenticated, getCurrentUser } = simpleAuth()
  const currentUser = getCurrentUser()

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const fetchEventTypes = () => {
    // Fetch event types for the active cohort
    fetchIt(`${Settings.apiHost}/eventtypes`)
      .then(setEventTypes)
      .catch(error => console.error('Error fetching event types:', error))
  }

  const fetchCohortEvents = () => {
    // Fetch events for the active cohort
    fetchIt(`${Settings.apiHost}/events?cohort=${activeCohortDetails.id}`)
      .then(data => {
        // Process the events data and organize by date
        const eventsByDate = {}
        data.forEach(event => {
          const eventDate = new Date(event.event_datetime)
          // Create dateKey using local date components to avoid timezone issues
          const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`

          if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = []
          }

          eventsByDate[dateKey].push({
            id: event.id,
            name: event.event_name,
            time: new Date(event.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: event.description,
            color: event.event_type.color,
          })
        })

        setEvents(eventsByDate)
      })
      .catch(error => console.error('Error fetching events:', error))
  }

  // Generate calendar days based on cohort start and end dates
  useEffect(() => {
    if (activeCohortDetails && activeCohortDetails?.start_date && activeCohortDetails?.end_date) {
      fetchEventTypes()
      fetchCohortEvents()

      const startDate = new Date(activeCohortDetails.start_date + 'T00:00:00')
      let endDate = new Date(activeCohortDetails.end_date + 'T00:00:00')

      const days = []
      const months = []
      let currentDate = new Date(startDate)

      // Track months for headers
      let currentMonth = ''

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const date = currentDate.getDate()
        const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' })
        const monthYear = `${monthName} ${year}`

        // Add month to months array if it's a new month
        if (monthYear !== currentMonth) {
          months.push({
            monthYear,
            startIndex: days.length
          })
          currentMonth = monthYear
        }

        days.push({
          date: new Date(currentDate),
          day: date,
          month,
          year
        })

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setCalendarDays(days)
      setCalendarMonths(months)
    }
    else {
      getCohort(currentUser.profile.current_cohort.id)
    }
  }, [activeCohortDetails])



  // Get dates between two dates (inclusive)
  const getDatesBetween = (startDate, endDate) => {
    const dates = []
    let currentDate = new Date(Math.min(startDate.getTime(), endDate.getTime()))
    const lastDate = new Date(Math.max(startDate.getTime(), endDate.getTime()))

    // Set hours to 0 to compare dates only
    currentDate.setHours(0, 0, 0, 0)
    lastDate.setHours(0, 0, 0, 0)

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  // Handle mouse down on a day - prepare for potential drag selection
  const handleDayMouseDown = (day, event) => {
    // Prevent default to avoid text selection
    event.preventDefault()

    // Prepare for potential drag operation
    setMouseDownActive(true)
    setDragStartDate(day.date)
    setSelectedDates([day.date])
  }

  // Handle mouse move over a day during drag
  const handleDayMouseMove = (day) => {
    if (mouseDownActive && dragStartDate) {
      // If mouse is moving while button is down, we're now officially dragging
      if (!isDragging) {
        setIsDragging(true)
      }

      // Update selected dates based on drag range
      const datesBetween = getDatesBetween(dragStartDate, day.date)
      setSelectedDates(datesBetween)
    }
  }

  // Handle mouse up - end drag selection and show dialog
  const handleDayMouseUp = () => {
    // If we were in a drag operation
    if (isDragging && selectedDates.length > 0) {
      // Sort dates chronologically
      const sortedDates = [...selectedDates].sort((a, b) => a - b)
      setSelectedDates(sortedDates)

      // Show add dialog with selected date range
      setShowAddDialog(true)
    }

    // Reset states regardless of whether we were dragging
    setIsDragging(false)
    setMouseDownActive(false)
  }

  // Handle mouse leave from calendar area
  const handleCalendarMouseLeave = () => {
    if (isDragging || mouseDownActive) {
      setIsDragging(false)
      setMouseDownActive(false)
    }
  }

  // Handle day double click - immediately show add dialog and prevent view dialog
  const handleDayDoubleClick = (day) => {
    // Mark that a double-click has occurred
    isDoubleClickRef.current = true

    // Clear any pending single-click timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }

    setSelectedDate(day.date)
    setSelectedDates([]) // Clear any drag selection
    setShowAddDialog(true)

    // Reset the double-click flag after a delay
    setTimeout(() => {
      isDoubleClickRef.current = false
    }, 500)
  }

  // Handle day click - set a timeout before showing the view dialog
  const handleDayClick = (day) => {
    // If we're dragging, don't trigger click
    if (isDragging) return

    // Set the selected date immediately
    setSelectedDate(day.date)
    setSelectedDates([]) // Clear any drag selection

    // Set a timeout to show the dialog after a delay
    clickTimeoutRef.current = setTimeout(() => {
      // Only show the view dialog if no double-click was detected
      if (!isDoubleClickRef.current) {
        setShowViewDialog(true)
      }
      clickTimeoutRef.current = null
    }, 300) // 300ms delay to allow for double-click detection
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    // Create dateKey using local date components to avoid timezone issues
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const eventsForDate = events[dateKey] || []
    return eventsForDate
  }

  const deleteEvent = async (id) => {
    const response = await fetchIt(`${Settings.apiHost}/events/${id}`, { method: "DELETE"})

    if (response.status === 204) {
      fetchCohortEvents()
    }
    else {
      window.alert("Error removing event")
    }
  }

  const generateEventCards = (selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      const dateKeyLookup = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`
      const eventsForDate = events[dateKeyLookup] || []

      if (eventsForDate.length > 0) {
        return eventsForDate.map((event, index) => (
          <Card key={`event-${index}`}>
            <Flex direction="column" justify="start">
              <Flex justify="between">
                <Text weight="bold">{event.name}</Text>
                <Text>{event.time}</Text>
              </Flex>
              <Text>{event.description}</Text>
            </Flex>
            {
              currentUser.profile.instructor && <Button color="red" mt="4" onClick={async () => { await deleteEvent(event.id) }}>Delete</Button>
            }
          </Card>
        ))
      }
      return <Text>No events for this date</Text>
    }
  }


  return (
    <div className="cohort-calendar">
      <div className="calendar-container" onMouseLeave={handleCalendarMouseLeave}>
        <div className='eventTypeLegend'>
          {eventTypes.map((type, index) => (
            <React.Fragment key={`event-type-${index}`}>
              <div style={{ margin: "0 0.1rem 0 0" }}>{type.description}</div>
              <div key={index} className="event-type" style={{ backgroundColor: type.color }}></div>
            </React.Fragment>
          ))}
        </div>
        <div className="months-grid">
          {calendarMonths.map((month, monthIndex) => (
            <div key={`month-${monthIndex}`} className="month-container">
              <h3 className="month-header">{month.monthYear}</h3>
              <div className="calendar-grid">
                {/* Day headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={`${day}${idx}`} className="day-header">
                    {day}
                  </div>
                ))}

                {/* Empty cells for proper day alignment */}
                {(() => {
                  // Get the first day of the current month from calendarDays
                  const firstDayOfMonth = calendarDays[month.startIndex]
                  // Calculate how many empty cells we need based on the day of week (0 = Sunday, 1 = Monday, etc.)
                  const emptyCellsNeeded = firstDayOfMonth.date.getDay()

                  return Array.from({ length: emptyCellsNeeded }).map((_, i) => (
                    <div key={`empty-start-${monthIndex}-${i}`} className="calendar-day empty-day"></div>
                  ))
                })()}

                {/* Calendar days */}
                {calendarDays.slice(
                  month.startIndex,
                  monthIndex < calendarMonths.length - 1 ? calendarMonths[monthIndex + 1].startIndex : calendarDays.length
                ).map((day, i) => {
                  const dateEvents = getEventsForDate(day.date)

                  return (
                    <div
                      key={`day-${day.date}`}
                      className="calendar-day"
                      style={{
                        backgroundColor: dateEvents.length > 0 ? dateEvents[0].color : 'goldenrod',
                        color: dateEvents.length > 0 ? 'white' : 'black'
                      }}
                      onClick={() => handleDayClick(day)}
                      onDoubleClick={() => currentUser.profile.instructor ? handleDayDoubleClick(day) : null}
                      onMouseDown={(e) => currentUser.profile.instructor ? handleDayMouseDown(day, e) : null}
                      onMouseMove={() => currentUser.profile.instructor ? handleDayMouseMove(day) : null}
                      onMouseUp={() => currentUser.profile.instructor ? handleDayMouseUp() : null}
                    >
                      <span className="day-number">{day.day}</span>
                      {dateEvents.length > 0 && (
                        <span className="event-indicator"></span>
                      )}
                    </div>
                  )
                })}

                {/* Empty cells at the end of the month */}
                {monthIndex < calendarMonths.length - 1 && (() => {
                  const lastDayOfMonth = new Date(
                    calendarDays[calendarMonths[monthIndex + 1].startIndex - 1].date
                  )
                  const emptyCells = 6 - lastDayOfMonth.getDay()
                  return Array.from({ length: emptyCells }).map((_, i) => (
                    <div key={`empty-end-${i}`} className="calendar-day empty-day"></div>
                  ))
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddEventDialog selectedDate={selectedDate} selectedDates={selectedDates}
        fetchCohortEvents={fetchCohortEvents} eventTypes={eventTypes} showAddDialog={showAddDialog}
        setSelectedDates={setSelectedDates} setShowAddDialog={setShowAddDialog} />

      {/* View Events Dialog */}
      <Dialog.Root open={showViewDialog} onOpenChange={setShowViewDialog}>
        <Dialog.Content>
          <Dialog.Title>{selectedDate && `Events for ${selectedDate.toLocaleDateString()}`}</Dialog.Title>

          <Flex direction="column" gap="3">
            {generateEventCards(selectedDate)}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}