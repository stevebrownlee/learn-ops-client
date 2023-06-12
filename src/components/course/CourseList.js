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

        <div className="courses">
            {
                courses.map(course => <CourseCard course={course} />)
            }
        </div>

        <footer className="courses__footer">
            <button className="isometric-button blue"
                style={{margin: "3rem 0 0 3rem"}}
                onClick={() => history.push("/courses/new")}>
                <span>Create Course</span>
            </button>
        </footer>
    </article>
}