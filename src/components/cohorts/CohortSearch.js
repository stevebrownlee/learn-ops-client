import React, { useCallback, useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider.js"
import { Student } from "../people/Student.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"

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
        getCohort(cohort.id)
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
                cohortStudents.count > 0
                    ? <section>
                        <div>{cohortStudents.count} students</div>
                        <div className="table table--students">
                            {cohortStudents.results
                                .sort((prev, curr) => curr.score - prev.score)
                                .map( student => <Student key={`student--${student.id}`} student={student} /> )
                            }
                        </div>
                    </section>
                    : ""
            }
        </>
    )
}
