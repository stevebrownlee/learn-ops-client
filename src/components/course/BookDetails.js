import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Button } from "@radix-ui/themes"


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

        <h3>Core Projects</h3>
        <div className="book__projects">
            {
                projects
                    .filter(project => project.active && !project.is_group_project)
                    .map(project => <section key={project.id} className="book__project"
                    onClick={() => {
                        history.push(`/projects/${project.id}`)
                    }}
                >
                    <div>{project.name}</div>
                </section>)
            }
        </div>

        <h3>Group Project</h3>
        <div className="book__projects">
            {
                projects
                    .filter(project => project.active && project.is_group_project)
                    .map(project => <section key={project.id} className="book__project book__project--group"
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
            <Button style={{ marginTop: "2rem" }}
                onClick={() => history.push(`/projects/new/${book.id}`)}>Add Project</Button>

            {
                book.has_assessment
                    ? ""
                    : <Button style={{ margin: "2rem 0 0 1rem" }}
                        onClick={() => history.push({
                            pathname: `/assessments/new`,
                            state: { book }
                        })}>Add Self-Assessment</Button>
            }

            <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="orange"
                onClick={() => {
                    history.push(`/books/edit/${book.id}`)
                }}>Edit Book</Button>

            <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                onClick={() => {
                    deleteBook(book.id).then(() => history.push(`/courses/${activeCourse.id}`))
                }}>Delete Book</Button>
        </div>

        <h3>Deprecated Projects</h3>
        <div className="book__projects">
            {
                projects
                    .filter(project => !project.active)
                    .map(project => <section key={project.id} className="book__project book__project--deprecated"
                    onClick={() => {
                        history.push(`/projects/${project.id}`)
                    }}
                >
                    <div>{project.name}</div>
                </section>)
            }
        </div>

    </section>
}
