import React, { useContext, useEffect, useState } from "react"
import { Button, Badge, Flex, Text, Box, Container, Section, TextField } from '@radix-ui/themes'
import { useHistory } from "react-router-dom"

import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "../course/CourseProvider.js"
import "./CohortForm.css"


export const CohortForm = () => {
    const [courses, setCourses] = useState([])
    const [serverSideCourse, setServer] = useState(0)
    const [clientSideCourse, setClient] = useState(0)
    const [cohort, updateCohort] = useState({
        name: "",
        startDate: "",
        endDate: "",
        orgURL: "",
        slackChannel: "C06GHMZB3M3",
        active: true
    })
    const { getCourses } = useContext(CourseContext)
    const history = useHistory()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    const constructNewCohort = () => {
        const requestBody = { ...cohort, clientSide: clientSideCourse, serverSide: serverSideCourse }

        // Iterate the cohort object and validate that all properties have a value
        for (const [key, value] of Object.entries(cohort)) {
            if (value === "") {
                alert("Please fill out all fields.")
                return
            }
        }

        if (clientSideCourse === 0 || serverSideCourse === 0) {
            alert("Please select a course for both client and server side.")
            return
        }

        fetchIt(`${Settings.apiHost}/cohorts`, {
            method: "POST",
            body: JSON.stringify(requestBody)
        })
            .then(() => history.push("/cohorts"))
    }

    const handleUserInput = (event) => {
        const copy = { ...cohort }
        copy[event.target.id] = event.target.value
        updateCohort(copy)
    }

    return (
    <Container>
        <Flex className="cohortForm view" direction="row" gap="1rem" justify="between">
            <Section className="cohortForm__fields">
                <Text as="h2" size="5" weight="bold" className="cohortForm__title">New Cohort</Text>
                <Box className="form-group">
                <label htmlFor="name">
                    Cohort name
                    <HelpIcon tip="Day Cohort 62, for example." />
                </label>
                <input onChange={handleUserInput}
                    value={cohort.name}
                    type="text" required autoFocus
                    id="name" className="form-control" />
                </Box>

                <Box className="form-group">
                    <Text as="label" htmlFor="orgURL">Github Org URL</Text>
                    <input onChange={handleUserInput}
                        value={cohort.orgURL}
                        type="url" required
                        id="orgURL" className="form-control" />
                </Box>

                <Box className="form-group">
                    <Flex align="center" gap="1">
                        <Text as="label" htmlFor="slackChannel">
                            Instructor Slack Channel ID
                        </Text>
                        <HelpIcon tip="Click on the instructor channel name at the top of Slack. Channel ID is at the bottom of pop-up." />
                    </Flex>
                    <input onChange={handleUserInput}
                        value={cohort.slackChannel}
                        type="text" required
                        id="slackChannel" className="form-control" />
                </Box>

                <Box className="form-group">
                    <Text as="label" htmlFor="startDate">Start date</Text>
                    <input onChange={handleUserInput}
                        value={cohort.startDate}
                        type="date" required
                        id="startDate" className="form-control" />
                </Box>

                <Box className="form-group">
                    <Text as="label" htmlFor="endDate">End date</Text>
                    <input onChange={handleUserInput}
                        value={cohort.endDate}
                        type="date" required
                        id="endDate" className="form-control" />
                </Box>

            <Button color="blue"
                onClick={
                    evt => {
                        evt.preventDefault()
                        constructNewCohort()
                    }
                }
                className="isometric-button blue"> Create </Button>
            </Section>
            <Section className="cohortForm__courses">
                <Box as="fieldset">
                    <Text as="h3" size="3" weight="bold">Client side</Text>
                    <Flex className="form-group" wrap="wrap" gap="1">
                    {
                        courses.map(course => {
                            return <Badge key={`course--${course.id}`}
                                id={`course--${course.id}`}
                                style={{ margin: "0 0.15rem", padding: "0.5rem", cursor: "pointer"}}
                                color={`${clientSideCourse === course.id ? "tomato" : "gray"}`}
                                variant="solid"
                                onClick={e => {
                                    e.preventDefault()
                                    setClient(course.id)
                                }}>
                                {course.name}
                            </Badge>
                        })
                    }
                    </Flex>
                </Box>
                <Box as="fieldset">
                    <Text as="h3" size="3" weight="bold">Server side</Text>
                    <Flex className="form-group" wrap="wrap" gap="1">
                    {
                        courses.map(course => {
                            return <Badge key={`course--${course.id}`}
                                style={{ margin: "0 0.15rem", padding: "0.5rem", cursor: "pointer"}}
                                color={`${serverSideCourse === course.id ? "tomato" : "gray"}`}
                                variant="solid"
                                onClick={e => {
                                    e.preventDefault()
                                    setServer(course.id)
                                }}>
                                {course.name}
                            </Badge>
                        })
                    }
                    </Flex>
                </Box>
            </Section>
        </Flex>
    </Container>
    )
}
