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
    const [sortedStudents, setSortedStudents] = useState([])
    const [groupedStudents, setGroupedStudents] = useState(new Map())
    const [sortAsc, setSortAsc] = useState(true)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
            getCohort(id)
        }
    }, [])

    useEffect(() => {
        /* eslint-disable no-undef */
        const copy = structuredClone(cohortStudents)
        copy.sort((thisOne, nextOne) => thisOne.book.name > nextOne.book.name ? 1 : -1)

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

        setGroupedStudents(Array.from(grouped))
    }, [cohortStudents])

    return (
        <>
            {
                groupedStudents.length > 0
                    ? <section className="cohortStudents">
                        {
                            groupedStudents.map((column) => {
                                return <article className="bookColumn">
                                    <header className="bookColumn__header">{ column[0] }</header>
                                    {
                                        column[1].map(student => <Student key={`student--${student.id}`} student={student} />)
                                    }
                                </article>
                            })
                        }

                    </section>
                    : ""
            }
        </>
    )
}
