import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"
import { CohortSearchField } from "./CohortSearchField.js"
import "./CohortStudentList.css"

export const StudentCardList = () => {
    const { findCohort, getCohort, activeCohort } = useContext(CohortContext)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)
    const [sortBy, specifySortFunction] = useState("score")
    const [sortAsc, setSortAsc] = useState(true)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
            getCohort(id)
        }
    }, [])

    return (
        <>
            {
                cohortStudents.length > 0
                    ? <section className="cohortStudents">
                        {
                            cohortStudents
                                .map(student => <Student key={`student--${student.id}`} student={student} />)
                        }
                    </section>
                    : ""
            }
        </>
    )
}
