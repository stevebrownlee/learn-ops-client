import React, { useContext, useEffect, useState } from "react"
import useModal from "../ui/useModal.js"
import { CourseContext } from "../course/CourseProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import { BookProjectDialog } from "../dashboard/BookProjectDialog.js"
import { AssessmentStatusDialog } from "../dashboard/AssessmentStatusDialog.js"
import { TagDialog } from "../dashboard/TagDialog.js"
import { StudentNoteDialog } from "../dashboard/StudentNoteDialog.js"
import { CohortDialog } from "../dashboard/CohortDialog.js"
import { StudentDetails } from "../people/StudentDetails.js"
import "./CohortStudentList.css"
import "./Tooltip.css"

export const StudentCardList = ({ searchTerms }) => {
    const { getCourses, activeCourse } = useContext(CourseContext)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)
    const [groupedStudents, setGroupedStudents] = useState([])
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
        let copy = structuredClone(cohortStudents)

        if (searchTerms !== "" && searchTerms.length > 2) {
            copy = copy.filter(student => {
                const hasTag = student.tags.find(tag => tag.tag.name.toLowerCase().includes(searchTerms.toLowerCase()))
                const nameMatches = student.name.toLowerCase().includes(searchTerms.toLowerCase())

                return hasTag || nameMatches
            })
        }

        const studentsPerBook = activeCourse?.books?.map(book => {
            const students = copy.filter(student => student.book.id === book.id)
            book.students = students
            return book
        })

        setGroupedStudents(studentsPerBook)
    }, [cohortStudents, searchTerms, activeCourse])

    return <section className="cohortStudents">
        {
            groupedStudents?.map((book) => {
                return <article key={`book--${book.id}`} className="bookColumn">
                    <header className="bookColumn__header">
                        <div className="bookColumn__name">
                            {book.name}
                        </div>
                    </header>
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

        <StudentDetails toggleCohorts={toggleCohorts} />
        <BookProjectDialog toggleProjects={toggleProjects} />
        <AssessmentStatusDialog toggleStatuses={toggleStatuses} />
        <TagDialog toggleTags={toggleTags} />
        <StudentNoteDialog toggleNote={toggleNote} />
        <CohortDialog toggleCohorts={toggleCohorts} />
    </section>
}
