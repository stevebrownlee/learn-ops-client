import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
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
import { Toast, configureToasts } from "toaster-js"
import "./CohortStudentList.css"
import "./Tooltip.css"
import { CohortContext } from "./CohortProvider.js"
import { PeopleIcon } from "../../svgs/PeopleIcon.js"

export const StudentCardList = ({ searchTerms }) => {
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const { activeCohort } = useContext(CohortContext)
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

        /*
        [
            {
                id: 0,
                name: "",
                project: ""

                students: [{}, {}]
            }
        ]

        */

        const test = activeCourse?.books?.map(book => {
            for (const project of book.projects) {
                const students = copy.filter(student => student.book.id === book.id && student.book.project === project.name)
                project.students = students

            }
            return book
        })

        console.log(test)

        const studentsPerBook = activeCourse?.books?.map(book => {
            const students = copy.filter(student => student.book.id === book.id)
            book.students = students
            return book
        })

        setGroupedStudents(studentsPerBook)
    }, [cohortStudents, searchTerms])

    return <section className="cohortStudents">
        {
            groupedStudents?.map((book) => {
                return book.students.length === 0
                    ? ""
                    :  <article key={`book--${book.id}`} className="bookColumn">
                    <header className="bookColumn__header">
                        <div className="bookColumn__name">
                            <div className="bookColumn__studentCount"> </div>
                            <div>
                            {book.name}

                            </div>
                            <div className="bookColumn__studentCount">
                                <PeopleIcon /> {book.students.length}

                            </div>
                        </div>
                    </header>
                    <section className="bookColumn__projects">
                        {
                            book.projects.map(project => {
                                if (project.students.length) {
                                    return <div key={`book-project--${project.id}`} className="bookColumn__projectHeader">
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
                        }
                    </section>

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
