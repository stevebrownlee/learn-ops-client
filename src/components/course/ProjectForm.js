import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const ProjectForm = () => {
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const { getBooks, getCourses } = useContext(CourseContext)
    const [project, updateProject] = useState({
        name: "",
        book: 0,
        course: 0,
        implementation_url: ""
    })
    const history = useHistory()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        if (project.course !== 0) {
            getBooks(project.course).then(setBooks)
        }
    }, [project])

    const constructNewProject = () => {
        fetchIt(`${Settings.apiHost}/projects`, { method: "POST", body: JSON.stringify(project) })
            .then(() => history.push("/projects"))
    }

    const updateState = (event) => {
        const copy = { ...project }
        copy[event.target.id] = event.target.value
        updateProject(copy)
    }

    return (
        <>
            <form className="projectForm view">
                <h2 className="projectForm__title">New Project</h2>
                <div className="form-group">
                    <label htmlFor="name">
                        Project name
                        <HelpIcon tip="Day Project 62, for example." />
                    </label>
                    <input onChange={updateState}
                        value={project.name}
                        type="text" required autoFocus
                        id="name" className="form-control"
                    />
                </div>

                <fieldset>
                    <div className="form-group">
                        <select id="course" className="form-control"
                            value={project.course}
                            controltype="number"
                            onChange={updateState}>
                            <option value="0">Select course...</option>
                            {
                                courses.map(course => {
                                    return <option key={`course--${course.id}`} value={course.id}>
                                        {course.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <select id="book" className="form-control"
                            value={project.book}
                            controltype="number"
                            onChange={updateState}>
                            <option value="0">Select book...</option>
                            {
                                books.map(book => {
                                    return <option key={`book--${book.id}`} value={book.id}>
                                        {book.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </fieldset>

                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            constructNewProject()
                        }
                    }
                    className="btn btn-primary"> Create </button>
            </form>
        </>
    )
}
