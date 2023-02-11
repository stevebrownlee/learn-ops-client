import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
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
                <h2 className="courseForm__title">New Course</h2>
                <div className="form-group">
                    <label htmlFor="name"> Course name </label>
                    <input onChange={updateState}
                        value={course.name}
                        type="text" required autoFocus
                        controltype="string"
                        id="name" className="form-control"
                    />
                </div>

                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()

                            if (mode === "create") {
                                createCourse(course).then(() => history.push("/courses"))
                            }
                            else {
                                editCourse(course).then(() => history.push("/courses"))
                            }
                        }
                    }
                    className="btn btn-primary"> Save </button>
            </form>
        </>
    )
}
