import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { CohortContext } from "../cohorts/CohortProvider"
import { CourseContext } from "../course/CourseProvider"

export const BookProjectDialog = ({ toggleProjects }) => {
    const { activeStudent, setStudentCurrentProject, getCohortStudents } = useContext(PeopleContext)
    const { activeCourse } = useContext(CourseContext)
    const { activeCohort } = useContext(CohortContext)
    const [book, setBook] = useState({})
    const [bookProjects, setBookProjects] = useState([])

    useEffect(() => {
        if ("id" in book) {
            console.log(activeCourse.books)
            const projects = activeCourse.books.find(b => b.id === book.id).projects
            setBookProjects(projects)
        }
    }, [book])

    return <dialog id="dialog--projects" className="dialog--projects">
        {
            activeCourse?.books?.map(book => <button
                onClick={() => {
                    setBook(book)
                }}>{book.name}</button>)
        }
        <select id="project"
            onChange={(e) => {
                setStudentCurrentProject(activeStudent.id, parseInt(e.target.value))
                    .then(() => {
                        getCohortStudents(activeCohort.id)
                        toggleProjects()
                        setBook({})
                        setBookProjects([])
                    })
            }}
        >
            <option value="0">Choose project</option>
            {
                bookProjects.map(project => {
                    return <option value={project.id}>{project.name}</option>
                })
            }
        </select>
        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={toggleProjects}>[ close ]</button>
    </dialog>
}
