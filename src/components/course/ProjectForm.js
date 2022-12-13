import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import "./ProjectForm.css"
import { CourseContext } from "./CourseProvider.js"


export const ProjectForm = () => {
    const { getBooks, getCourses } = useContext(CourseContext)
    const [project, updateProject] = useState({
        name: "",
        book: 0,
        cohort: 0
    })
    const history = useHistory()

    const constructNewProject = () => {
        fetchIt(`${Settings.apiHost}/projects`, { method: "POST", body: JSON.stringify(project)})
            .then(() => history.push("/projects"))
    }

    const handleUserInput = (event) => {
        const copy = {...project}
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
                    <input onChange={handleUserInput}
                        value={project.name}
                        type="text" required autoFocus
                        id="name" className="form-control"
                    />
                </div>

                <fieldset>
                    <div className="form-group">
                        <select id="bookId" className="form-control"
                            value={assessment.bookId}
                            controltype="number"
                            onChange={updateState}>
                                <option value="0">Select book...</option>
                                {
                                    books.map(book => {
                                        if (!book.has_assessment) {
                                            return <option key={`book--${book.id}`} value={book.id}>
                                                {book.course.name} - {book.name}
                                            </option>
                                        }
                                    })
                                }
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <select id="bookId" className="form-control"
                            value={assessment.bookId}
                            controltype="number"
                            onChange={updateState}>
                                <option value="0">Select book...</option>
                                {
                                    books.map(book => {
                                        if (!book.has_assessment) {
                                            return <option key={`book--${book.id}`} value={book.id}>
                                                {book.course.name} - {book.name}
                                            </option>
                                        }
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
