import React, { useContext, useEffect, useState } from "react"
import { Button, Badge } from '@radix-ui/themes'
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

    return (<form className="cohortForm view">
        <section className="cohortForm__fields">
            <h2 className="cohortForm__title">New Cohort</h2>
            <div className="form-group">
                <label htmlFor="name">
                    Cohort name
                    <HelpIcon tip="Day Cohort 62, for example." />
                </label>
                <input onChange={handleUserInput}
                    value={cohort.name}
                    type="text" required autoFocus
                    id="name" className="form-control" />
            </div>

            <div className="form-group">
                <label htmlFor="name">Github Org URL</label>
                <input onChange={handleUserInput}
                    value={cohort.orgURL}
                    type="url" required
                    id="orgURL" className="form-control" />
            </div>

            <div className="form-group">
                <label>
                    Instructor Slack Channel ID
                    <HelpIcon tip="Click on the instructor channel name at the top of Slack. Channel ID is at the bottom of pop-up." />
                </label>
                <input onChange={handleUserInput}
                    value={cohort.slackChannel}
                    type="text" required
                    id="slackChannel" className="form-control" />
            </div>

            <div className="form-group">
                <label htmlFor="startDate">Start date</label>
                <input onChange={handleUserInput}
                    value={cohort.startDate}
                    type="date" required
                    id="startDate" className="form-control" />
            </div>

            <div className="form-group">
                <label htmlFor="endDate">End date</label>
                <input onChange={handleUserInput}
                    value={cohort.endDate}
                    type="date" required
                    id="endDate" className="form-control" />
            </div>

            <Button color="blue"
                onClick={
                    evt => {
                        evt.preventDefault()
                        constructNewCohort()
                    }
                }
                className="isometric-button blue"> Create </Button>

        </section>

        <section className="cohortForm__courses">
            <fieldset>
                <h3 htmlFor="endDate">Client side</h3>
                <div className="form-group">
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
                </div>
            </fieldset>

            <fieldset>
                <h3 htmlFor="endDate">Server side</h3>
                <div className="form-group">
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
                </div>
            </fieldset>
        </section>

    </form>
    )
}
