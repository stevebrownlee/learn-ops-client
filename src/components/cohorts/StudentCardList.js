import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useModal from "../ui/useModal"

import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "./CohortProvider"

import { TagDialog } from "../dashboard/TagDialog"
import { CohortDialog } from "../dashboard/CohortDialog"
import { StudentNoteDialog } from "../dashboard/StudentNoteDialog"
import { AssessmentStatusDialog } from "../dashboard/AssessmentStatusDialog"

import { StudentDetails } from "../people/StudentDetails"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { Student } from "../people/Student"
import { StandupContext } from "../dashboard/Dashboard"
import { Toast, configureToasts } from "toaster-js"
import { Loading } from "../Loading.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"

import "./CohortStudentList.css"
import "./Tooltip.css"

export const StudentCardList = ({ searchTerms }) => {
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const {
        showAllProjects, toggleAllProjects, dragStudent,
        draggedStudent, showTags, showAvatars
    } = useContext(StandupContext)
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { cohortStudents, getCohortStudents, setStudentCurrentProject, activeStudent } = useContext(PeopleContext)
    const [groupedStudents, setGroupedStudents] = useState([])
    const history = useHistory()

    let { toggleDialog: toggleStatuses, modalIsOpen: statusIsOpen } = useModal("#dialog--statuses")
    let { toggleDialog: toggleTags, modalIsOpen: tagIsOpen } = useModal("#dialog--tags")
    let { toggleDialog: toggleNote, modalIsOpen: noteIsOpen } = useModal("#dialog--note")
    let { toggleDialog: toggleCohorts, modalIsOpen: cohortIsOpen } = useModal("#dialog--cohorts")


    const getComponentData = (cohortId) => {
        return getActiveCourse(cohortId)
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
        const cohort = JSON.parse(localStorage.getItem("activeCohort"))
        if (cohort) {
            const cohortId = parseInt(cohort)
            if (!activeCohort) {
                activateCohort(cohortId)
            }
        }
        else {
            history.push("/cohorts")
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
        }
    }, [])

    useEffect(() => {
        /* eslint-disable no-undef */
        let copy = structuredClone(cohortStudents)

        let floorBookIndex = -1
        let ceilingBookIndex = activeCourse?.books ? activeCourse?.books[activeCohort?.books?.length - 1]?.index : 0

        const studentsPerBook = activeCourse?.books?.map(book => {
            book.studentCount = 0
            book.display = false

            for (const project of book.projects) {
                project.display = false
                project.droppable = false
                project.students = copy.filter(student => student.book.id === book.id && student.book.project === project.name)


                if (project.students.length > 0) {
                    book.display = true
                    project.display = true
                    book.studentCount += project.students.length
                }

                if (searchTerms !== "" && searchTerms.length > 2) {
                    let reg = searchTerms.split("").reduce((r, c) => `${r}.*${c}`, "")
                    const regex = new RegExp(reg, "gi")
                    project.students = project.students.filter(student => {
                        const hasTag = student.tags.find(tag => tag.tag.name.toLowerCase().includes(searchTerms.toLowerCase()))
                        const nameMatches = student.name.match(regex)

                        return hasTag || nameMatches
                    })
                }

                if (
                    (floorBookIndex > -1 && book.index >= floorBookIndex)
                    || (book.studentCount && floorBookIndex === -1)
                    || (floorBookIndex === -1 && book.index === 0)
                    || project.display
                ) {
                    project.droppable = true
                }
            }

            if (book.studentCount && floorBookIndex === -1) floorBookIndex = book.index
            if (book.studentCount > 0) ceilingBookIndex = book.index

            return book
        })


        if (studentsPerBook) {
            setGroupedStudents(studentsPerBook)
        }
    }, [cohortStudents, searchTerms, showTags, showAvatars])

    const showBook = (book) => {
        const showInRegularMode = !showAllProjects && book.display
        const isStudentCurrentBook = book.index === draggedStudent?.bookIndex
        const isStudentNextBook = book.index === draggedStudent?.bookIndex + 1
        const showInStandupMode = showAllProjects && (isStudentCurrentBook || isStudentNextBook)

        return showInRegularMode || showInStandupMode
    }

    const assignStudentToProject = (studentId, projectId) => {
        setStudentCurrentProject(studentId, projectId)
            .then(() => getCohortStudents(activeCohort))
            .catch((error) => {
                if (error?.message?.includes("duplicate")) {
                    new Toast("Student has previously been assigned to that project.", Toast.TYPE_ERROR, Toast.TIME_NORMAL);
                }
                else {
                    new Toast("Could not assign student to that project.", Toast.TYPE_ERROR, Toast.TIME_NORMAL);
                }
            })
    }

    const handleDrop = (e, book, project) => {
        e.preventDefault()
        toggleAllProjects(false)
        dragStudent(null)

        const targetBook = book
        const data = e.dataTransfer.getData("text/plain")
        const rawStudent = Object.assign(Object.create(null), JSON.parse(data))

        // Student being moved to another book yet assessment not marked as complete
        if (
            rawStudent.hasAssessment &&
            book.id !== rawStudent.bookId &&
            rawStudent.assessment_status !== 4
        ) {
            new Toast("Self-assessment for this book not marked as reviewed and complete.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
        }
        else {
            assignStudentToProject(rawStudent.id, project.id)
        }
    }

    const showStudentCardsForProject = (book, project) => {
        return project.students.map(student => <Student
            toggleStatuses={toggleStatuses}
            toggleTags={toggleTags}
            toggleNote={toggleNote}
            assignStudentToProject={assignStudentToProject}
            hasAssessment={book.assessments.length > 0}
            toggleCohorts={toggleCohorts}
            key={`student--${student.id}`}
            student={student} />)
    }

    return <section className="cohortStudents"> {
        groupedStudents.length === 0
            ? <Loading />
            : groupedStudents?.map((book) => {
                return showBook(book)
                    ? <article key={`book--${book.id}--${showTags}--${showAvatars}`} className="bookColumn">
                        <header className="bookColumn__header">
                            <div className="bookColumn__name">
                                <div className="bookColumn__studentCount">&nbsp;</div>
                                <div> {book.name} </div>
                                <div className="bookColumn__studentCount">
                                    <PeopleIcon />
                                    <div style={{
                                        padding: "0.2rem 0.33rem 0 0.33rem",
                                    }}>{book.studentCount}</div>
                                </div>
                            </div>
                        </header>
                        <section className="bookColumn__projects"> {
                            book.projects.map(project => {
                                if (
                                    (showAllProjects && project.droppable)
                                    || (!showAllProjects && project.display)
                                ) {
                                    return <div id={`book-project--${project.id}`}
                                        key={`book-project--${project.id}`}
                                        className="projectColumn"
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, book, project)}
                                    >
                                        <div className="projectColumn__header"
                                            onMouseOver={evt => {
                                                evt.target.innerText = project.name
                                            }}
                                            onMouseOut={evt => {
                                                evt.target.innerText = showAllProjects ? project.name.substring(0, 3) : project.name
                                            }}
                                        >
                                            {showAllProjects ? project.name.substring(0, 14) : project.name}
                                        </div>

                                        <div className="projectColumn__students">
                                            { showStudentCardsForProject(book, project) }
                                        </div>

                                    </div>
                                }
                                return ""
                            })
                        } </section>
                    </article>
                    : ""
            })
    }

        <StudentDetails toggleCohorts={toggleCohorts} />
        <AssessmentStatusDialog toggleStatuses={toggleStatuses} statusIsOpen={statusIsOpen} />
        <TagDialog toggleTags={toggleTags} tagIsOpen={tagIsOpen} />
        <StudentNoteDialog toggleNote={toggleNote} noteIsOpen={noteIsOpen} />
        <CohortDialog toggleCohorts={toggleCohorts} cohortIsOpen={cohortIsOpen} />
    </section>
}
