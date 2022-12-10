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
            const projects = activeCourse.books.find(b => b.id === book.id).projects
            setBookProjects(projects)
        }
    }, [book])

    return <dialog id="dialog--projects" className="dialog--projects">
        <section className="bookButtons">
            {
                activeCourse?.books?.map(book => {
                    if (book.name !== "Book 0") {
                        return <button className="button-28" style={{ margin: "0.2rem" }} key={`bk--${book.id}`}
                            onClick={() => {
                                setBook(book)
                            }}>{book.name}</button>
                    }
                })
            }
        </section>

        <section className="projectSelect">
            {
                bookProjects.length > 0
                    ? <select id="project"
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
                                return <option key={`pro--${project.id}`} value={project.id}>{project.name}</option>
                            })
                        }
                    </select>
                    : ""
            }
        </section>

        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={() => {
                toggleProjects()
                setBook({})
                setBookProjects([])
            }}>[ close ]</button>
    </dialog>
}
