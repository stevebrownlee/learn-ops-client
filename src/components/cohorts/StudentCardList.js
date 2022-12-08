import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CourseContext } from "../course/CourseProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortSearchField } from "./CohortSearchField.js"
import { Student } from "../people/Student.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import "./CohortStudentList.css"
import { BookProjectDialog } from "../dashboard/BookProjectDialog.js"
import useModal from "../ui/useModal.js"
import { AssessmentStatusDialog } from "../dashboard/AssessmentStatusDialog.js"

export const StudentCardList = () => {
    const { findCohort, getCohort, activeCohort } = useContext(CohortContext)
    const { getCourses, course, activeCourse } = useContext(CourseContext)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)
    const [sortBy, specifySortFunction] = useState("score")
    const [groupedStudents, setGroupedStudents] = useState([])
    const [sortAsc, setSortAsc] = useState(true)
    let { toggleDialog: toggleProjects } = useModal("#dialog--projects")
    let { toggleDialog: toggleStatuses } = useModal("#dialog--statuses")

    useEffect(() => {

        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCourses().then(() => {
                getCohortStudents(id)
            })
        }
    }, [])

    useEffect(() => {
        /* eslint-disable no-undef */
        const copy = structuredClone(cohortStudents)

        const studentsPerBook = activeCourse?.books?.map(book => {
            const students = cohortStudents.filter(student => student.book.id === book.id)
            book.students = students
            return book
        })

        const grouped = copy.reduce(
            (theMap, currentStudent) => {
                if (!theMap.has(currentStudent.book.name)) {
                    theMap.set(currentStudent.book.name, [currentStudent])
                }
                else {
                    theMap.get(currentStudent.book.name).push(currentStudent)
                }
                return theMap
            },
            new Map()
        )

        setGroupedStudents(studentsPerBook)
    }, [cohortStudents])

    return <section className="cohortStudents">
        {
            groupedStudents?.map((book) => {
                return <article key={`book--${book.id}`} className="bookColumn">
                    <header className="bookColumn__header">{book.name}</header>
                    {
                        book.students.map(student => <Student
                            toggleProjects={toggleProjects}
                            toggleStatuses={toggleStatuses}
                            key={`student--${student.id}`}
                            student={student} />)
                    }
                </article>
            })
        }

        <BookProjectDialog toggleProjects={toggleProjects} />
        <AssessmentStatusDialog toggleStatuses={toggleStatuses} />
    </section>
}
