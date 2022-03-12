import React, { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"
import "./CohortStudentList.css"

export const CohortSearch = () => {
    const { findCohort, getCohort, activeCohort } = useContext(CohortContext)
    const { getCohortStudents, cohortStudents } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [active, setActive] = useState(false)
    const [cohorts, setCohorts] = useState([])
    const [sortBy, specifySortFunction] = useState("score")
    const [sortAsc, setSortAsc] = useState(true)


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
    }, [getCohort])

    const handleSearchKey = (evt) => {
        if (evt.keyCode === 92) {
            evt.preventDefault()
            document.getElementById("search__terms--cohort").focus()
        }
    }

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
            getCohort(id)
            setActive(true)
        }

        document.addEventListener("keypress", handleSearchKey)
        return () => document.removeEventListener("keypress", handleSearchKey)
    }, [])

    const search = (e) => {
        if (e.keyCode === 13) {
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
                    autoFocus
                    value={terms}
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

                        <div className="cohortStudents__sort">
                            Sort by <button onClick={() => {
                                sortBy === "score" ? setSortAsc(!sortAsc) : setSortAsc(true)
                                specifySortFunction("score")
                            }}
                                className="fakeLink">score</button> or {" "}
                            <button onClick={() => {
                                sortBy === "name" ? setSortAsc(!sortAsc) : setSortAsc(true)
                                specifySortFunction("name")
                            }}
                                className="fakeLink">last name</button>
                        </div>

                        {
                            active
                                ? ""
                                : <div>
                                    <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            localStorage.setItem("activeCohort", activeCohort.id)
                                            setActive(true)
                                        }}
                                    >Set as my active cohort</a>
                                </div>
                        }

                        <div className="table">
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
