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

    return <section key={`course--${course.id}`} className="book__project"
        onClick={() => {
            setActiveCourse(course)
            history.push(`/courses/${course.id}`)
        }}
    >
        <div>{course.name}</div>
        <div>
            <i className="button__icon icon icon-book"></i>&nbsp;
            {course.books.length} books
        </div>
    </section>
}



