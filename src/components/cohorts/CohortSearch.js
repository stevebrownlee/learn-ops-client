import React, { useCallback, useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"
// import "./Search.css"

export const CohortSearch = () => {
    const { findCohort, getCohort } = useContext(CohortContext)
    const { getCohortStudents, cohortStudents } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [cohorts, setCohorts] = useState([])

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
        setTerms("")
    }, [getCohort])

    const handleSearchKey = (evt) => {
        if (evt.keyCode === 92) {
            evt.preventDefault()
            document.getElementById("search__terms--cohort").focus()
        }
    }

    useEffect(() => {
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
                    onChange={e => {
                        setTerms(e.target.value)
                    }}
                    autoFocus
                    value={terms}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search"
                    aria-label="Search" />

                <CohortResults cohorts={cohorts} selectCohort={selectCohort} />
            </div>


            {
                cohortStudents.length
                    ? <div className="table table--students">
                        {cohortStudents
                            .map(student => {
                                const learningScore = student.records.reduce(
                                    (total, current) => {
                                        return total + current.weights.reduce(
                                            (tot, curr) => tot + curr.score, 0
                                        )
                                    }, 0
                                )
                                student.score = learningScore
                                return student
                            })
                            .sort((prev, curr) => curr.score - prev.score)
                            .map(student => (

                                <Student key={`student--${student.id}`} student={student} />
                            ))
                        }
                    </div>
                    : ""
            }

        </>
    )
}
