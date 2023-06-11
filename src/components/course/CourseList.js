import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./Courses.css"
import { NoteIcon } from "../../svgs/NoteIcon.js"
import { GridIcon } from "../../svgs/GridIcon.js"

export const CourseList = () => {
    const { getCourses, createCourse } = useContext(CourseContext)
    const [courses, setCourses] = useState([])
    const history = useHistory()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    return <article className="container--bookList">
        <header className="book__header">
            <button className="button button--isi button--border-thick button--round-l button--size-s"
                onClick={() => history.push("/courses/new")}>
                <i className="button__icon icon icon-book"></i>
                <span>Create Course</span>
            </button>
        </header>

        <div className="courses">
            {
                courses.map(course => {
                    return <section key={`course--${course.id}`} className="course">
                        <h3 className="course__header">{course.name}</h3>

                        <div> <NoteIcon /> {course.books.length} books </div>
                        <div> <GridIcon /> {course.books.reduce((c,n) => {return c+n.projects.length}, 0)} projects </div>


                        <footer className="course__footer">
                            <EditIcon tip={"Edit this course"} clickFunction={() => history.push(`/courses/edit/${course.id}`)} />
                        </footer>
                    </section>
                })
            }
        </div>
    </article>
}