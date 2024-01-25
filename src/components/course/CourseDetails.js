import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"
import { Button } from "@radix-ui/themes"
import { CourseDetailsChart } from "./CourseDetailsChart.js"


export const CourseDetails = () => {
    const [books, changeBooksState] = useState([])
    const history = useHistory()
    const { courseId } = useParams()

    const {
        getBooks, getCourse, activeCourse,
        setActiveCourse, deactivateCourse
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
            <Button style={{ marginTop: "2rem" }}
                onClick={() => history.push(`/books/new/${activeCourse.id}`)}>Add Book</Button>

            <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="orange"
                onClick={() => {
                    history.push(`/courses/edit/${activeCourse.id}`)
                }}>Edit Course</Button>

            <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                onClick={() => {
                    deactivateCourse(activeCourse.id).then(() => history.push(`/courses`))
                }}>Delete Course</Button>
        </div>

        <CourseDetailsChart courseId={courseId} />
    </section>
}
