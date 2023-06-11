import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min.js"

import { GridIcon } from "../../svgs/GridIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"
import "./Course.css"


export const CourseCard = ({ course }) => {
    const history = useHistory()
    const { setActiveCourse } = useContext(CourseContext)

    return <section key={`course--${course.id}`} className="course">
        <h3 className="course__header">
            <Link to={`/courses/${course.id}`}
                onClick={() => {
                    setActiveCourse(course)
                }} >{course.name}</Link>
        </h3>

        <div> <NoteIcon /> {course.books.length} books </div>
        <div> <GridIcon /> {course.books.reduce((c, n) => c + n.projects.length, 0)} projects </div>

        <footer className="course__footer">
            <EditIcon tip={"Edit this course"} clickFunction={() => history.push(`/courses/edit/${course.id}`)} />
        </footer>
    </section>
}
