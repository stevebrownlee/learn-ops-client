import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import { Button } from "@radix-ui/themes"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const CourseForm = () => {
    const { createCourse, getCourse, editCourse } = useContext(CourseContext)
    const [mode, setMode] = useState("create")
    const [course, updateCourse] = useState({
        name: ""
    })
    const history = useHistory()
    const { courseId } = useParams()

    useEffect(() => {
        if (courseId) {
            getCourse(courseId).then(data => {
                updateCourse(data)
            })
            setMode("edit")
        }
    }, [courseId])

    const updateState = (event) => {
        const copy = { ...course }

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
        updateCourse(copy)
    }

    return (
        <>
            <form className="courseForm view">
                <h2 className="courseForm__title">{mode === "edit" ? "Edit" : "New"} Course</h2>
                <div className="form-group">
                    <label htmlFor="name"> Course name </label>
                    <input onChange={updateState}
                        value={course.name}
                        type="text" required autoFocus
                        controltype="string"
                        id="name" className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input id="active" type="checkbox" controltype="boolean" checked={course.active} onChange={updateState} />
                    <label htmlFor="active" style={{ margin: "0 0 0 0.5rem" }}>Active</label>
                </div>

                <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="blue"
                    onClick={evt => {
                        evt.preventDefault()

                        if (mode === "create") {
                            createCourse(course).then(() => history.push("/courses"))
                        }
                        else {
                            editCourse(course).then(() => history.push("/courses"))
                        }
                    }}>Save</Button>

                <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                    onClick={evt => {
                        evt.preventDefault()
                        history.push("/courses")
                    }}>Cancel</Button>
            </form>
        </>
    )
}
