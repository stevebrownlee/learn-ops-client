import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"


export const CourseDetails = () => {
    const [books, changeBooksState] = useState([])
    const history = useHistory()
    const { courseId } = useParams()

    const {
        getBooks, getCourse, activeCourse, setActiveCourse,
        deactivateCourse
    } = useContext(CourseContext)

    useEffect(() => {
        if (!(activeCourse && "id" in activeCourse)) {
            getCourse(courseId).then(setActiveCourse)
        }
    }, [])

    useEffect(() => {
        if (activeCourse && "id" in activeCourse) {
            getBooks(activeCourse.id).then(changeBooksState)
        }
    }, [activeCourse])

    return <section className="course--detail">
        <h1 className="coursedetail__header">
            <Link to={`/courses`}>Courses</Link>&nbsp; &gt; &nbsp;
            {activeCourse?.name}
        </h1>

        <article className="course__books">
            {
                books.map(book => <section key={book.id} className="course__book"
                    onClick={() => {
                        history.push(`/books/${book.id}`)
                    }}
                >
                    <div>{book.name}</div>
                    <div>
                        <i className="button__icon icon icon-book"></i>&nbsp;
                        {book.projects} projects
                    </div>
                </section>)
            }
        </article>

        <div className="course__footer">
            <button style={{ marginTop: "2rem" }}
                className="isometric-button blue"
                onClick={() => history.push(`/books/new/${activeCourse.id}`)}>Add Book</button>

            <button style={{ marginTop: "2rem", marginLeft: "auto" }}
                className="isometric-button yellow"
                onClick={() => {
                    history.push(`/courses/edit/${activeCourse.id}`)
                }}>Edit Course</button>

            <button style={{ marginTop: "2rem" }}
                className="isometric-button red"
                onClick={() => {
                    deactivateCourse(activeCourse.id).then(() => history.push(`/courses`))
                }}>Delete Course</button>
        </div>
    </section>
}
