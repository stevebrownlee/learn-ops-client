import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
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
import keyboardShortcut from "../ui/keyboardShortcut.js"

import "./CohortStudentList.css"
import "./Tooltip.css"

const persistSettings = (setting, value) => {
    let settings = localStorage.getItem("lp_settings")

    if (settings) {
        settings = JSON.parse(settings)
        settings[setting] = value
        localStorage.setItem("lp_settings", JSON.stringify(settings))
    }
    else {
        localStorage.setItem("lp_settings", JSON.stringify({ [setting]: value }))
    }
}

export const StudentCardList = ({ searchTerms }) => {
    let initial_show_tags_state = true
    let initial_show_avatars_state = true

    let settings = localStorage.getItem("lp_settings")
    if (settings) {
        settings = JSON.parse(settings)
        if ("tags" in settings) {
            initial_show_tags_state = settings.tags
        }
        if ("avatars" in settings) {
            initial_show_avatars_state = settings.avatars
        }
    }

    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const {
        showAllProjects, toggleAllProjects, dragStudent, draggedStudent,
        enteringNote
    } = useContext(StandupContext)
    const { cohortStudents, getCohortStudents, setStudentCurrentProject, activeStudent } = useContext(PeopleContext)

    const [showTags, toggleTags] = useState(initial_show_tags_state)
    const [groupedStudents, setGroupedStudents] = useState([])
    const [showAvatars, toggleAvatars] = useState(initial_show_avatars_state)

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
    });

    const toggleTagsShortcut = keyboardShortcut('t', 'g', () => {
        if (!noteOpenStateRef.current && !enteringNoteStateRef.current) {
            persistSettings('tags', !tagsStateRef.current)
            toggleTags(!tagsStateRef.current)
        }
    })

    const toggleAvatarsShortcut = keyboardShortcut('t', 'a', () => {
        if (!noteOpenStateRef.current && !enteringNoteStateRef.current) {
            persistSettings('avatars', !avatarsStateRef.current)
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
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
        }

        document.addEventListener("keyup", toggleTagsShortcut)
        document.addEventListener("keyup", toggleAvatarsShortcut)
        return () => {
            document.removeEventListener("keyup", toggleTagsShortcut)
            document.removeEventListener("keyup", toggleAvatarsShortcut)
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
            showTags={showTags}
            showAvatars={showAvatars}
            toggleStatuses={toggleStatuses}
            toggleTags={toggleTagDialog}
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

        <StudentDetails toggleCohorts={toggleCohorts} />
        <AssessmentStatusDialog toggleStatuses={toggleStatuses} statusIsOpen={statusIsOpen} />
        <TagDialog toggleTags={toggleTagDialog} tagIsOpen={tagIsOpen} />
        <StudentNoteDialog toggleNote={toggleNote} noteIsOpen={noteIsOpen} />
        <CohortDialog toggleCohorts={toggleCohorts} cohortIsOpen={cohortIsOpen} />
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