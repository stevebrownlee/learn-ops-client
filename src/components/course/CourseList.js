import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./Courses.css"
import { NoteIcon } from "../../svgs/NoteIcon.js"
import { GridIcon } from "../../svgs/GridIcon.js"
import { CourseCard } from "./CourseCard.js"

export const CourseList = () => {
    const { getCourses, createCourse } = useContext(CourseContext)
    const [courses, setCourses] = useState([])
    const history = useHistory()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    return <article className="container--bookList">
        <header className="courses__header">
            <button className="isometric-button blue"
                style={{margin: "1rem 0 0 3rem"}}
                onClick={() => history.push("/courses/new")}>
                <span>Create Course</span>
            </button>
        </header>

        <div className="courses">
            {
                courses.map(course => <CourseCard key={course.id} course={course} />)
            }
        </div>

    </article>
}