import React, { useContext, useState, useEffect } from 'react';
import { Dialog, Button, TextField, TextArea, Text, Flex, Card } from '@radix-ui/themes';
import { CohortContext } from './CohortProvider';
import './CohortCalendar.css';
import { fetchIt } from '../utils/Fetch.js';
import Settings from '../Settings.js';

export const CohortCalendar = () => {
  const { activeCohortDetails, activeCohort } = useContext(CohortContext);
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [calendarMonths, setCalendarMonths] = useState([]);

  // Generate calendar days based on cohort start and end dates
  useEffect(() => {
    if (activeCohortDetails?.start_date && activeCohortDetails?.end_date) {

      // Use fetchIt to get events for the cohort
      fetchIt(`${Settings.apiHost}/events?cohort=${activeCohortDetails.id}`)
        .then(data => {
          // Process the events data and organize by date
          const eventsByDate = {};
          data.forEach(event => {
            const eventDate = new Date(event.event_datetime);
            const dateKey = eventDate.toISOString().split('T')[0];

            if (!eventsByDate[dateKey]) {
              eventsByDate[dateKey] = [];
            }

            eventsByDate[dateKey].push({
              id: event.id,
              name: event.event_name,
              time: new Date(event.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: event.description
            });
          });

          setEvents(eventsByDate);
        })
        .catch(error => console.error('Error fetching events:', error));

      const startDate = new Date(activeCohortDetails.start_date);
      const endDate = new Date(activeCohortDetails.end_date);

      const days = [];
      const months = [];
      let currentDate = new Date(startDate);

      // Track months for headers
      let currentMonth = '';

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
        const monthYear = `${monthName} ${year}`;

        // Add month to months array if it's a new month
        if (monthYear !== currentMonth) {
          months.push({
            monthYear,
            startIndex: days.length
          });
          currentMonth = monthYear;
        }

        days.push({
          date: new Date(currentDate),
          day: date,
          month,
          year
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setCalendarDays(days);
      setCalendarMonths(months);
    }
  }, [activeCohortDetails]);

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!selectedDate || !eventName) return;

    // API is expecting a single datetime string, so we format it accordingly
    const eventDate = new Date(selectedDate);
    eventDate.setHours(0, 0, 0, 0); // Set time to midnight for consistency
    const eventTimeParts = eventTime.split(':');
    if (eventTimeParts.length === 2) {
      eventDate.setHours(parseInt(eventTimeParts[0], 10), parseInt(eventTimeParts[1], 10));
    }
    // Create a new event object

    const dateKey = selectedDate.toISOString().split('T')[0];
    const newEvent = {
      cohort: activeCohortDetails.id,
      datetime: eventDate.toISOString(),
      name: eventName,
      description: eventDescription
    };

    // POST the new event to the API
    fetchIt(`${Settings.apiHost}/events?cohort=${activeCohortDetails.id}`, {
      method: 'POST',
      body: JSON.stringify(newEvent),
      token: activeCohortDetails.token
    })
      .then(response => {
        if (response.ok) {
          // Update local state with the new event
          setEvents(prevEvents => {
            const updatedEvents = { ...prevEvents };
            if (!updatedEvents[dateKey]) {
              updatedEvents[dateKey] = [];
            }
            updatedEvents[dateKey].push({
              name: eventName,
              time: eventTime,
              description: eventDescription
            });
            return updatedEvents;
          });
        } else {
          throw new Error('Failed to add event');
        }
      })
      .catch(error => console.error('Error adding event:', error));




    // Reset form
    setEventName('');
    setEventTime('');
    setEventDescription('');
    setShowAddDialog(false);
  };

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDate(day.date);
    setShowAddDialog(true);
  };

  // Handle day double click
  const handleDayDoubleClick = (day) => {
    setSelectedDate(day.date);
    setShowViewDialog(true);
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return events[dateKey] || [];
  };

  // No need for inline styles as we're using CSS classes

  return (
    <div className="cohort-calendar">
      <div className="calendar-container">
        <div className="months-grid">
          {calendarMonths.map((month, monthIndex) => (
            <div key={`month-${monthIndex}`} className="month-container">
              <h3 className="month-header">{month.monthYear}</h3>
              <div className="calendar-grid">
              {/* Day headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day,idx) => (
                <div key={`${day}${idx}`} className="day-header">
                  {day}
                </div>
              ))}

              {/* Empty cells for proper day alignment */}
              {(() => {
                // Get the first day of the current month from calendarDays
                const firstDayOfMonth = calendarDays[month.startIndex];
                // Calculate how many empty cells we need based on the day of week (0 = Sunday, 1 = Monday, etc.)
                const emptyCellsNeeded = firstDayOfMonth.date.getDay();

                return Array.from({ length: emptyCellsNeeded }).map((_, i) => (
                  <div key={`empty-start-${monthIndex}-${i}`} className="calendar-day empty-day"></div>
                ));
              })()}

              {/* Calendar days */}
              {calendarDays.slice(
                month.startIndex,
                monthIndex < calendarMonths.length - 1 ? calendarMonths[monthIndex + 1].startIndex : calendarDays.length
              ).map((day, i) => {
                const dateEvents = getEventsForDate(day.date);
                return (
                  <div
                    key={`day-${day.date}`}
                    className="calendar-day"
                    style={{
                      backgroundColor: dateEvents.length > 0 ? 'purple' : 'goldenrod',
                      color: dateEvents.length > 0 ? 'white' : 'black'
                    }}
                    onClick={() => handleDayClick(day)}
                    onDoubleClick={() => handleDayDoubleClick(day)}
                  >
                    <span className="day-number">{day.day}</span>
                    {dateEvents.length > 0 && (
                      <span className="event-indicator"></span>
                    )}
                  </div>
                );
              })}

              {/* Empty cells at the end of the month */}
              {monthIndex < calendarMonths.length - 1 && (() => {
                const lastDayOfMonth = new Date(
                  calendarDays[calendarMonths[monthIndex + 1].startIndex - 1].date
                );
                const emptyCells = 6 - lastDayOfMonth.getDay();
                return Array.from({ length: emptyCells }).map((_, i) => (
                  <div key={`empty-end-${i}`} className="calendar-day empty-day"></div>
                ));
              })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
        <Dialog.Content>
          <Dialog.Title>Add Event</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {selectedDate && `Add an event for ${selectedDate.toLocaleDateString()}`}
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
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* View Events Dialog */}
      <Dialog.Root open={showViewDialog} onOpenChange={setShowViewDialog}>
        <Dialog.Content>
          <Dialog.Title>Events</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {selectedDate && `Events for ${selectedDate.toLocaleDateString()}`}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event, index) => (
                <Card key={`event-${index}`}>
                  <Flex direction="column" gap="1">
                    <Flex justify="between">
                      <Text weight="bold">{event.name}</Text>
                      <Text>{event.time}</Text>
                    </Flex>
                    <Text>{event.description}</Text>
                  </Flex>
                </Card>
              ))
            ) : (
              <Text>No events for this day</Text>
            )}
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
  );
};