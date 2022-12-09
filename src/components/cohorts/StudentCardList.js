import React, { useContext, useEffect, useState } from "react"
import useModal from "../ui/useModal.js"
import { Link } from "react-router-dom"
import { CourseContext } from "../course/CourseProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "./CohortProvider.js"
import { Student } from "../people/Student.js"
import { BookProjectDialog } from "../dashboard/BookProjectDialog.js"
import { AssessmentStatusDialog } from "../dashboard/AssessmentStatusDialog.js"
import { TagDialog } from "../dashboard/TagDialog.js"
import { StudentNoteDialog } from "../dashboard/StudentNoteDialog.js"
import "./CohortStudentList.css"
import "./Tooltip.css"
import { CohortDialog } from "../dashboard/CohortDialog.js"

export const StudentCardList = () => {
    const { findCohort, getCohort, activeCohort } = useContext(CohortContext)
    const { getCourses, course, activeCourse } = useContext(CourseContext)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)
    const [sortBy, specifySortFunction] = useState("score")
    const [groupedStudents, setGroupedStudents] = useState([])
    const [sortAsc, setSortAsc] = useState(true)
    let { toggleDialog: toggleProjects } = useModal("#dialog--projects")
    let { toggleDialog: toggleStatuses } = useModal("#dialog--statuses")
    let { toggleDialog: toggleTags } = useModal("#dialog--tags")
    let { toggleDialog: toggleNote } = useModal("#dialog--note")
    let { toggleDialog: toggleCohorts } = useModal("#dialog--cohorts")

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
                            toggleTags={toggleTags}
                            toggleNote={toggleNote}
                            toggleCohorts={toggleCohorts}
                            key={`student--${student.id}`}
                            student={student} />)
                    }
                </article>
            })
        }

        <BookProjectDialog toggleProjects={toggleProjects} />
        <AssessmentStatusDialog toggleStatuses={toggleStatuses} />
        <TagDialog toggleTags={toggleTags} />
        <StudentNoteDialog toggleNote={toggleNote} />
        <CohortDialog toggleCohorts={toggleCohorts} />
    </section>
}
