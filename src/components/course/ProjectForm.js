import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const ProjectForm = () => {
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [title, setTitle] = useState("")
    const [mode, setMode] = useState("create")
    const { getBooks, getCourses, getProject, editProject, getBook } = useContext(CourseContext)
    const [project, updateProject] = useState({
        name: "",
        book: 0,
        course: 0,
        index: 0,
        implementation_url: "",
        active: true,
        is_group_project: false
    })
    const history = useHistory()
    const { projectId, bookId } = useParams()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        if (projectId) {
            getProject(projectId).then((project) => {
                updateProject({ ...project, course: project.course.id, book: project.book.id })
            })
            setMode("edit")
        }
    }, [projectId])

    useEffect(() => {
        if (bookId) {
            getBook(bookId).then((book) => {
                updateProject({...project, book: book.id, course: book.course.id})
                setTitle(`${book.course.name} > ${book.name} > New Project`)
            })
            setMode("create")
        }
    }, [bookId])

    useEffect(() => {
        if (project.course !== 0) {
            getBooks(project.course.id).then(setBooks)
        }
    }, [project])

    const constructNewProject = () => {
        fetchIt(`${Settings.apiHost}/projects`, { method: "POST", body: JSON.stringify(project) })
            .then(() => history.push(`/books/${project.book}`))
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
                <h2 className="projectForm__title">{title}</h2>

                <div className="form-group">
                    <label htmlFor="name">
                        Project name
                    </label>
                    <input onChange={updateState}
                        value={project.name}
                        type="text" required autoFocus
                        controltype="string"
                        id="name" className="form-control"
                    />
                </div>

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

                <div className="form-group">
                    <input onChange={updateState}
                        checked={project.is_group_project}
                        type="checkbox" required
                        controltype="boolean"
                        id="is_group_project"
                    />
                    <label htmlFor="is_group_project"> Group project </label>
                </div>

                <div className="form-group">
                    <input onChange={updateState}
                        checked={project.active}
                        type="checkbox" required
                        controltype="boolean"
                        id="active"
                    />
                    <label htmlFor="active"> Active </label>
                </div>

                <button type="submit" className="isometric-button blue"
                    onClick={
                        evt => {
                            evt.preventDefault()

                            if (mode === "create") {
                                constructNewProject()
                            }
                            else {
                                editProject(project).then(() => history.push(`/books/${project.book}`))
                            }
                        }
                    }> Save </button>

                <button type="submit"
                    style={{ margin: "0 0 0 1rem" }}
                    className="isometric-button blue"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            history.push(`/books/${project.book}`)
                        }
                    }> Cancel </button>
            </form>
        </>
    )
}
