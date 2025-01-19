import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import Settings from "../Settings.js"
import { Button } from "@radix-ui/themes"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const ProjectForm = () => {
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [title, setTitle] = useState("")
    const [mode, setMode] = useState("create")
    const { getBooks, getCourses, getProject, getBook } = useContext(CourseContext)
    const [project, updateProject] = useState({
        name: "",
        book: 0,
        course: 0,
        index: 0,
        implementation_url: "",
        api_template_url: "",
        client_template_url: "",
        active: true,
        is_full_stack: false,
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
                updateProject({ ...project, book: book.id, course: book.course.id })
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

    const editProject = () => {
        fetchIt(`${Settings.apiHost}/projects/${project.id}`, { method: "PUT", body: JSON.stringify(project) })
            .then(() => history.push(`/books/${project.book}`))
    }

    const updateState = (event) => {
        const copy = { ...project }

        let targetValue = event.target.value

        // Remove apostrophes if the control type is string
        if (event.target.attributes.controltype.value === "string") {
            targetValue = targetValue.replace(/[']/g, '')
        }

        const newValue = {
            "string": targetValue,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(targetValue)
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

                {
                    project.is_group_project
                        ? <>
                            <div className="form-group">
                                <input onChange={updateState}
                                    checked={project.is_full_stack}
                                    type="checkbox" required
                                    controltype="boolean"
                                    id="is_full_stack"
                                />
                                <label htmlFor="is_full_stack"> Full stack project? </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">
                                    Client side template URL
                                </label>
                                <input onChange={updateState}
                                    value={project.client_template_url}
                                    type="text" required
                                    controltype="string"
                                    id="client_template_url"
                                    className="form-control"
                                />
                            </div>

                            {
                                project.is_full_stack
                                    ? <>
                                        <div className="form-group">
                                            <label htmlFor="name">
                                                API template URL
                                            </label>
                                            <input onChange={updateState}
                                                value={project.api_template_url}
                                                type="text" required
                                                controltype="string"
                                                id="api_template_url"
                                                className="form-control"
                                            />
                                        </div>
                                    </>
                                    : ""
                            }
                        </>
                        : ""
                }

                <div className="form-group">
                    <input onChange={updateState}
                        checked={project.active}
                        type="checkbox" required
                        controltype="boolean"
                        id="active"
                    />
                    <label htmlFor="active"> Active </label>
                </div>

                <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="blue"
                    onClick={evt => {
                        evt.preventDefault()

                        if (mode === "create") {
                            constructNewProject()
                        }
                        else {
                            editProject()
                        }
                    }}>Save</Button>

                <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                    onClick={evt => {
                        evt.preventDefault()
                        history.push(`/books/${project.book}`)
                    }}>Cancel</Button>
            </form>
        </>
    )
}
