import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"


export const BookDetails = () => {
    const [projects, changeProjectsState] = useState([])
    const [assessment, changeAssessmentState] = useState({})
    const [book, changeBookState] = useState({})
    const history = useHistory()
    const { bookId } = useParams()

    const {
        getBookProjects, getBook, activeCourse,
        deleteBook
    } = useContext(CourseContext)
    const { getBookAssessment } = useContext(AssessmentContext)

    useEffect(() => {
        getBook(bookId).then(changeBookState)
    }, [bookId])

    useEffect(() => {
        getBookProjects(bookId).then(changeProjectsState)
        getBookAssessment(bookId).then(changeAssessmentState)
    }, [book])

    return <section className="book--detail">
        <h1 className="book__header">
            <Link to={`/courses/${book?.course?.id}`}>{book?.course?.name}</Link>&nbsp; &gt; &nbsp;
            {book.name}
        </h1>

        <h3>Projects</h3>
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

        {
            book.has_assessment
                ? <>
                    <h3>Assessment</h3>
                    <section key={"book--assessment"} className="book__asssessment"
                        onClick={() => {
                            history.push(`/assessments/edit/${book.assessments[0].id}`)
                        }}
                    >
                        <div>{book.assessments[0].name}</div>
                    </section>
                </>
                : ""
        }

        <div className="book__footer">
            <button style={{ marginTop: "2rem" }}
                className="isometric-button blue"
                onClick={() => history.push(`/projects/new/${book.id}`)}>Add Project</button>

            {
                book.has_assessment
                    ? ""
                    : <button style={{ margin: "2rem 0 0 2rem" }}
                        className="isometric-button blue"
                        onClick={() => history.push({
                            pathname: `/assessments/new`,
                            state: { book }
                        })}>Add Self-Assessment</button>
            }


            <button style={{ marginTop: "2rem", marginLeft: "auto" }}
                className="isometric-button yellow"
                onClick={() => {
                    history.push(`/books/edit/${book.id}`)
                }}>Edit Book</button>

            <button style={{ marginTop: "2rem" }}
                className="isometric-button red"
                onClick={() => {
                    deleteBook(book.id).then(() => history.push(`/courses/${activeCourse.id}`))
                }}>Delete Book</button>
        </div>
    </section>
}
