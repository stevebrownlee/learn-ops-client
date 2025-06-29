import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import useModal from "../ui/useModal"

import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "./CohortProvider"
import { useSettings } from "../../hooks/useSettings"

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
import { OutlineGroupIcon } from "../../svgs/OutlineGroup.js"
import keyboardShortcut from "../ui/keyboardShortcut.js"

import "./CohortStudentList.css"
import "./Tooltip.css"
import { StudentAssessmentForm } from "../people/StudentAssessmentForm.js"

export const StudentCardList = ({ searchTerms }) => {
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const {
        showAllProjects, toggleAllProjects, dragStudent, draggedStudent,
        enteringNote
    } = useContext(StandupContext)
    const {
        cohortStudents, getCohortStudents, activeStudent,
        setStudentCurrentProject, setStudentCurrentAssessment,
    } = useContext(PeopleContext)

    // Use the settings hook instead of local state and localStorage
    const { showTags, toggleTags, showAvatars, toggleAvatars } = useSettings()

    const [groupedStudents, setGroupedStudents] = useState([])
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)

    const history = useHistory()

    let [toggleStatuses, statusIsOpen] = useModal("#dialog--statuses")
    let [toggleTagDialog, tagIsOpen] = useModal("#dialog--tags")
    let [toggleNote, noteIsOpen] = useModal("#dialog--note")
    let [toggleCohorts, cohortIsOpen] = useModal("#dialog--cohorts")

    // See footnote (1)
    const noteOpenStateRef = useRef(noteIsOpen)
    const avatarsStateRef = useRef(showAvatars)
    const tagsStateRef = useRef(showTags)
    const enteringNoteStateRef = useRef(enteringNote)

    useEffect(() => {
        noteOpenStateRef.current = noteIsOpen
        avatarsStateRef.current = showAvatars
        tagsStateRef.current = showTags
        enteringNoteStateRef.current = enteringNote
    })

    /*
        This function, and the useEffect below, were added to prevent the
        Radix Dialog element from blocking pointer events on the body
    */
    const removePointerEventsStyle = () => {
        document.body.style.pointerEvents = ''
    }

    useEffect(() => {
        return () => {
            if (!feedbackDialogOpen) {
                removePointerEventsStyle()
            }
        }
    }, [feedbackDialogOpen])

    const toggleTagsShortcut = keyboardShortcut('t', 'g', () => {
        if (!noteOpenStateRef.current && !enteringNoteStateRef.current) {
            toggleTags(!tagsStateRef.current)
        }
    })

    const toggleAvatarsShortcut = keyboardShortcut('t', 'a', () => {
        if (!noteOpenStateRef.current && !enteringNoteStateRef.current) {
            toggleAvatars(!avatarsStateRef.current)
        }
    })

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
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL)
        }

        document.addEventListener("keyup", toggleTagsShortcut)
        document.addEventListener("keyup", toggleAvatarsShortcut)
        return () => {
            document.removeEventListener("keyup", toggleTagsShortcut)
            document.removeEventListener("keyup", toggleAvatarsShortcut)
        }
    }, [])

    /*
        The purpose of this useEffect is to restructure the student data into a format that
        can be easily rendered in the component. This is done by grouping students by book and project.
        Assessments are treated as projects with an index of 99.

        The data structure is as follows:
        [
            {
                name: "Book 1",
                studentCount: 0,
                display: false,
                projects: [
                    {
                        name: "Project 1",
                        students: [],
                        display: false,
                        droppable: false
                    }
                ]
            }
        ]
    */
    useEffect(() => {
        /* eslint-disable no-undef */
        let copy = structuredClone(cohortStudents)

        let floorBookIndex = -1
        let ceilingBookIndex = activeCourse?.books ? activeCourse?.books[activeCohort?.books?.length - 1]?.index : 0

        const studentsPerBook = activeCourse?.books?.map(book => {
            const maxedAssessments = book.assessments.map(b => ({ ...b, index: 99 }))

            book.studentCount = 0
            book.display = false

            if (book.projects.find(p => p.index === 99) === undefined) {
                book.projects = [...book.projects, ...maxedAssessments]
            }

            copy = copy.map(s => ({ ...s, inGroupProject: false }))

            for (const project of book.projects) {
                project.display = false
                project.droppable = false


                // Account for core projects and being assigned to an assessment
                project.students = copy.filter(student => {
                    const studentWorkingOnCoreProject = student.book_id === book.id
                        && student.project_id === project.id
                        && student.assessment_status_id === 0

                    const studentWorkingOnAssessment = student.book_id === book.id
                        && student.assessment_status_id > 0
                        && project.index === 99

                    const studentWorkingOnGroupProject = student.book_id === book.id
                        && student.project_id === project.id
                        && project.is_group_project

                    if (studentWorkingOnGroupProject) {
                        student.inGroupProject = true
                    }

                    return studentWorkingOnCoreProject
                        || student.inGroupProject && project.is_group_project
                        || (studentWorkingOnAssessment && !student.inGroupProject)
                })

                if (project.students.length > 0) {
                    book.display = true
                    project.display = true
                    book.studentCount += project.students.length
                }

                if (searchTerms !== "" && searchTerms.length > 2) {
                    let reg = searchTerms.split("").reduce((r, c) => `${r}.*${c}`, "")
                    const regex = new RegExp(reg, "gi")
                    project.students = project.students.filter(student => {
                        const hasTag = student.tags.find(tag => tag.tag.toLowerCase().includes(searchTerms.toLowerCase()))
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

    const assignStudentToProject = (student, project) => {
        if (project.index === 99 && student.assessment_status === 0) {
            student.book_id = student.bookId // Snake case needed for the API
            setStudentCurrentAssessment(student).then(() => getCohortStudents(activeCohort))
            new Toast("Student assigned to assessment", Toast.TYPE_ERROR, Toast.TIME_NORMAL)
            return null
        }
        setStudentCurrentProject(student.id, project.id)
            .then(() => getCohortStudents(activeCohort))
            .catch((error) => {
                if (error?.message?.includes("duplicate")) {
                    new Toast("Student has previously been assigned to that project.", Toast.TYPE_ERROR, Toast.TIME_NORMAL)
                }
                else {
                    new Toast("Could not assign student to that project.", Toast.TYPE_ERROR, Toast.TIME_NORMAL)
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
            new Toast("Self-assessment for this book not marked as reviewed and complete.", Toast.TYPE_WARNING, Toast.TIME_NORMAL)
        }
        else {
            // Assign to assessment
            if (project.index === 99) {
                if (rawStudent.assessment_status === 0) {
                    setStudentCurrentAssessment(rawStudent)
                }
                else {
                    new Toast("Student already assigned to assessment.", Toast.TYPE_ERROR, Toast.TIME_NORMAL)
                }
            }
            // Assign to core project
            else {
                assignStudentToProject(rawStudent, project)
            }
        }
    }

    const showStudentCardsForProject = (book, project) => {
        return project.students.map(student => <Student
            showTags={showTags}
            showAvatars={showAvatars}
            toggleStatuses={toggleStatuses}
            toggleTags={toggleTagDialog}
            toggleNote={toggleNote}
            setFeedbackDialogOpen={setFeedbackDialogOpen}
            assignStudentToProject={assignStudentToProject}
            hasAssessment={book.assessments.length > 0}
            toggleCohorts={toggleCohorts}
            key={`student--${student.id}`}
            student={student} />)
    }

    return <section style={{ flex: "5 1 0" }} className="cohortStudents"> {
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
                                        padding: "0.1rem 0.33rem 0 0.33rem",
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
                                        <div className={`projectColumn__header ${project.index === 99 ? "projectColumn__header--assessment" : ""}`}>
                                            {
                                                project.is_group_project ?
                                                    <OutlineGroupIcon style={{
                                                        height: "1.1rem",
                                                        verticalAlign: "text-top",
                                                    }} />
                                                    : ""
                                            }
                                            {showAllProjects ? project.name.substring(0, 14) : ` ${project.name}`}
                                        </div>

                                        <div className="projectColumn__students">
                                            {showStudentCardsForProject(book, project)}
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

        {/*
            All student-specific dialogs are rendered here. Each one should pull `activeStudent` from
            the PeopleContext to access the student that was clicked on. This prevents multiple instances
            of the dialog from being rendered at the same time.

            Make sure that you invoke `activateStudent(student)` where needed before you display the
            dialog. This will set the `activeStudent` in the PeopleContext to the student that was clicked on.
        */}
        <StudentDetails toggleCohorts={toggleCohorts} />
        <TagDialog toggleTags={toggleTagDialog} tagIsOpen={tagIsOpen} />
        <StudentNoteDialog toggleNote={toggleNote} noteIsOpen={noteIsOpen} />
        <CohortDialog toggleCohorts={toggleCohorts} cohortIsOpen={cohortIsOpen} />
        <StudentAssessmentForm dialogOpen={feedbackDialogOpen} setDialogOpen={setFeedbackDialogOpen} />
    </section>
}



/*
    Footnotes
    ===========================

    (1)
    ------------
    The keyboard shortcut of `ta` will toggle the avatar images in the student cards.
    However, if someone has the StudentNoteDialog component open, the sequence of `ta`
    should not trigger the avatar toggling. Since I am using a regular DOM event
    listener, the current value of the state variable (in this case, `noteIsOpen`) is
    not up to date when the event fires.

    The solution is to track that state in a ref, whose current value will be accessible
    in the listener callback function.
*/