import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"
import "./CohortStudentList.css"

export const StudentCardList = () => {
    const { findCohort, getCohort, activeCohort } = useContext(CohortContext)
    const { getCohortStudents, cohortStudents } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [active, setActive] = useState(false)
    const [cohorts, setCohorts] = useState([])
    const [sortBy, specifySortFunction] = useState("score")
    const [sortAsc, setSortAsc] = useState(true)
    const cohortSearch = useRef()
    const searchLogger = useKeyboardShortcut('c', () => {
        cohortSearch.current.focus()
        setTerms("")
    })


    useEffect(() => {
        if (terms !== "") {
            findCohort(terms).then(setCohorts)
        }
        else {
            setCohorts([])
        }
    }, [terms, findCohort])

    const selectCohort = useCallback((cohort) => {
        getCohortStudents(cohort.id)
        getCohort(cohort.id)
        setTerms("")

        if (localStorage.getItem("activeCohort") && parseInt(localStorage.getItem("activeCohort")) === cohort.id) {
            setActive(true)
        }
        else {
            setActive(false)
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
            getCohort(id)
            setActive(true)
        }

        document.addEventListener("keypress", searchLogger)
        return () => document.removeEventListener("keypress", searchLogger)
    }, [])

    const search = (e) => {
        if (e.key === "Enter") {
            if (cohorts.length === 1) {
                selectCohort(cohorts[0])
            }
        }
    }

    const sortStudentsByLastName = (current, next) => {
        const [, clast] = current.name.split(" ")
        const [, nlast] = next.name.split(" ")
        let compare = null

        if (sortAsc) {
            compare = (clast).localeCompare(nlast);
        }
        else {
            compare = (nlast).localeCompare(clast);
        }
        return compare
    }

    const sortStudentsByScore = (current, next) => {
        let result = 0

        if (sortAsc) {
            result = next.score - current.score
        }
        else {
            result = current.score - next.score
        }
        return result
    }

    return (
        <>
            <header>
                <div className="titlebar">
                    <h3>Find Cohort</h3>
                </div>
            </header>
            <div className="search">
                <input id="search__terms--cohort"
                    onKeyUp={search}
                    onChange={e => setTerms(e.target.value)}
                    value={terms}
                    ref={cohortSearch}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search"
                    aria-label="Search" />

                <CohortResults cohorts={cohorts} selectCohort={selectCohort} />
            </div>

            {
                cohortStudents.length > 0
                    ? <section className="cohortStudents">

                        <Link to="/teams"> Show current teams </Link>

                        {
                            active
                                ? ""
                                : <div>
                                    <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            localStorage.setItem("activeCohort", activeCohort)
                                            setActive(true)
                                        }}
                                    >Set as my active cohort</a>
                                </div>
                        }

                        <div className="table">
                            <div className="cell">
                                <i className={`icon icon-${sortBy !== "score" && sortAsc ? "up" : "down"}`} style={{ fontSize: "1.2rem" }} onClick={() => {
                                    sortBy === "name" ? setSortAsc(!sortAsc) : setSortAsc(true)
                                    specifySortFunction("name")
                                }}></i>
                            </div>
                            <div className="cell">
                                <i className={`icon icon-${sortBy === "score" && !sortAsc ? "up" : "down"}`}
                                    style={{ fontSize: "1.2rem" }}
                                    onClick={() => {
                                        sortBy === "score" ? setSortAsc(!sortAsc) : setSortAsc(true)
                                            specifySortFunction("score")
                                    }}></i>
                            </div>
                            {
                                cohortStudents
                                    .sort(sortBy === "score" ? sortStudentsByScore : sortStudentsByLastName)
                                    .map(student => <Student key={`student--${student.id}`} student={student} />)
                            }
                        </div>
                        <div>
                            {cohortStudents.length} students
                        </div>
                    </section>
                    : ""
            }
        </>
    )
}
