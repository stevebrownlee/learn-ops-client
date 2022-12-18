import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const ProjectForm = () => {
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [mode, setMode] = useState("create")
    const { getBooks, getCourses, getProject, editProject } = useContext(CourseContext)
    const [project, updateProject] = useState({
        name: "",
        book: 0,
        course: 0,
        index: 0,
        implementation_url: ""
    })
    const history = useHistory()
    const { projectId } = useParams()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        if (projectId) {
            getProject(projectId).then(updateProject)
            setMode("edit")
        }
    }, [projectId])

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

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
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
                        controltype="string"
                        id="name" className="form-control"
                    />
                </div>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="course"> Course </label>
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
                        <label htmlFor="course"> Book </label>
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

                <div className="form-group">
                    <label htmlFor="index">
                        Position in book
                        <HelpIcon tip="First column project is 0. Second column is 1." />
                    </label>
                    <input onChange={updateState}
                        value={project.index}
                        type="number" required
                        controltype="number"
                        id="index" className="form-control"
                        style={{ maxWidth: "4rem" }}
                    />
                </div>


                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()

                            if (mode === "create") {
                                constructNewProject()
                            }
                            else {
                                editProject(project).then(() => history.push("/projects"))
                            }
                        }
                    }
                    className="btn btn-primary"> Save </button>
            </form>
        </>
    )
}
