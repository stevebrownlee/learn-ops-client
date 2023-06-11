import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"


export const BookDetails = () => {
    const [projects, changeProjectsState] = useState([])
    const [book, changeBookState] = useState({})
    const history = useHistory()
    const { bookId } = useParams()

    const {
        getBookProjects, getBook, activeCourse,
        deleteBook
    } = useContext(CourseContext)

    useEffect(() => {
        getBook(bookId).then(changeBookState)
    }, [bookId])

    useEffect(() => {
        getBookProjects(bookId).then(changeProjectsState)
    }, [book])

    return <section className="book--detail">
        <h1 className="book__header">
            <Link to={`/courses/${activeCourse.id}`}>{activeCourse.name}</Link>&nbsp; &gt; &nbsp;
            {book.name}
        </h1>

        <div className="book__projects">
            {
                projects.map(project => <section key={project.id} className="book__project"
                    onClick={() => {
                        history.push(`/projects/${project.id}`)
                    }}
                >
                    <div>{project.name}</div>
                </section>)
            }
        </div>

        <div className="book__footer">
            <button style={{ marginTop: "2rem" }}
                className="isometric-button blue"
                onClick={() => history.push(`/projects/new/${book.id}`)}>Add Project</button>


            <button style={{ marginTop: "2rem", marginLeft: "auto" }}
                className="isometric-button yellow"
                onClick={() => {
                    history.push(`/book/edit/${book.id}`)
                }}>Edit Book</button>

            <button style={{ marginTop: "2rem" }}
                className="isometric-button red"
                onClick={() => {
                    deleteBook(book.id).then(() => history.push(`/courses/${activeCourse.id}`))
                }}>Delete Book</button>

        </div>
    </section>
}
