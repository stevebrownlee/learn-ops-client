import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useModal from "../ui/useModal"

import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "./CohortProvider"

import { TagDialog } from "../dashboard/TagDialog"
import { CohortDialog } from "../dashboard/CohortDialog"
import { BookProjectDialog } from "../dashboard/BookProjectDialog"
import { StudentNoteDialog } from "../dashboard/StudentNoteDialog"
import { AssessmentStatusDialog } from "../dashboard/AssessmentStatusDialog"

import { StudentDetails } from "../people/StudentDetails"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { Student } from "../people/Student"
import { Toast, configureToasts } from "toaster-js"
import "./CohortStudentList.css"
import "./Tooltip.css"

export const StudentCardList = ({ searchTerms, showAllProjects }) => {
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)
    const [groupedStudents, setGroupedStudents] = useState([])
    const history = useHistory()

    let { toggleDialog: toggleProjects } = useModal("#dialog--projects")
    let { toggleDialog: toggleStatuses } = useModal("#dialog--statuses")
    let { toggleDialog: toggleTags } = useModal("#dialog--tags")
    let { toggleDialog: toggleNote } = useModal("#dialog--note")
    let { toggleDialog: toggleCohorts } = useModal("#dialog--cohorts")

    const getComponentData = (cohortId) => {
        return getCourses()
            .then(() => getActiveCourse(cohortId))
            .then(course => {
                localStorage.setItem("activeCourse", course.id)
                getCohortStudents(cohortId)
            })
    }

    useEffect(() => {
        if (activeCohort > 0) {
            getComponentData(activeCohort)
        }
    }, [activeCohort])

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const cohortId = parseInt(localStorage.getItem("activeCohort"))
            if (!activeCohort) {
                activateCohort(cohortId)
            }
            new Toast(`Loading default cohort`, Toast.TYPE_INFO, Toast.TIME_SHORT);
        }
        else {
            history.push("/cohorts")
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
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
            for (const project of book.projects) {
                const students = copy.filter(student => student.book.id === book.id && student.book.project === project.name)
                project.students = students
            }
            const bookStudents = copy.filter(student => student.book.id === book.id)
            book.students = bookStudents
            return book
        })

        setGroupedStudents(studentsPerBook)
    }, [cohortStudents, searchTerms])

    return <section className="cohortStudents"> {
        groupedStudents?.map((book) => {
            return book.students.length === 0 && !showAllProjects
                ? ""
                : <article key={`book--${book.id}`} className="bookColumn">
                    <header className="bookColumn__header">
                        <div className="bookColumn__name">
                            <div className="bookColumn__studentCount"> </div>
                            <div> {book.name} </div>
                            <div className="bookColumn__studentCount">
                                <PeopleIcon /> {book.students.length}
                            </div>
                        </div>
                    </header>
                    <section className="bookColumn__projects"> {
                        book.projects.map(project => {
                            if (showAllProjects || project.students.length) {
                                return <div id={`book-project--${project.id}`} key={`book-project--${project.id}`} className="bookColumn__projectHeader">
                                    <div className="bookColumn__project">
                                        {project.name}
                                    </div>

                                    {
                                        project.students.map(student => <Student
                                            toggleProjects={toggleProjects}
                                            toggleStatuses={toggleStatuses}
                                            toggleTags={toggleTags}
                                            toggleNote={toggleNote}
                                            toggleCohorts={toggleCohorts}
                                            key={`student--${student.id}`}
                                            student={student} />)
                                    }
                                </div>
                            }
                            return ""
                        })
                    } </section>
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
