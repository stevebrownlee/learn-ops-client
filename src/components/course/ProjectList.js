import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./Projects.css"


export const ProjectList = () => {
    const { getProjects, deleteProject, getBooks, getCourses } = useContext(CourseContext)
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(0)
    const [book, setBook] = useState(0)
    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const history = useHistory()

    useEffect(() => {
        getCourses().then(setCourses)
        getProjects().then(setProjects)
    }, [])

    useEffect(() => {
        setFilteredProjects(projects)
    }, [projects])

    useEffect(() => {
        if (book !== 0) {
            /* eslint-disable no-undef */
            let copy = structuredClone(projects)
            copy = copy.filter(p => p.book.id === book)
            setFilteredProjects(copy)
        }
    }, [book])

    useEffect(() => {
        if (course !== 0) {
            getBooks(course).then(setBooks)
            /* eslint-disable no-undef */
            let copy = structuredClone(projects)
            copy = copy.filter(p => p.course.id === course)
            setFilteredProjects(copy)
        }
    }, [course])

    return <article className="container--projectList">
        <header className="projects__header">
            <button className="button button--isi button--border-thick button--round-l button--size-s"
                onClick={() => history.push("/projects/new")}>
                <i className="button__icon icon icon-book"></i>
                <span>Create Project</span>
            </button>

            <div className="projects__filter">
                <select id="course" className="form-control"
                    value={course}
                    controltype="number"
                    onChange={(e) => setCourse(parseInt(e.target.value))}>
                    <option value="0">Filter by course...</option>
                    {
                        courses.map(course => {
                            return <option key={`course--${course.id}`} value={course.id}>
                                {course.name}
                            </option>
                        })
                    }
                </select>

                <select id="book" className="form-control"
                    value={book}
                    controltype="number"
                    onChange={(e) => setBook(parseInt(e.target.value))}>
                    <option value="0">Filter by book...</option>
                    {
                        books.map(book => {
                            return <option key={`book--${book.id}`} value={book.id}>
                                {book.name}
                            </option>
                        })
                    }
                </select>
            </div>
        </header>
        <div className="projects">

            {
                filteredProjects.map(project => {
                    return <section key={`project--${project.id}`} className="project">
                        <h3 className="project__header">{project.name}</h3>

                        <div className="project__info">
                            <div>{project.course.name} - {project.book.name}</div>
                            <div>Position: {project.index}</div>
                        </div>

                        <footer className="project__footer">
                            <EditIcon clickFunction={() => history.push(`/projects/edit/${project.id}`)} />

                            <DeleteIcon clickFunction={() => deleteProject(project.id)
                                .then(getProjects)
                                .then(setProjects)} />
                        </footer>
                    </section>
                })
            }
        </div>
    </article>
}
