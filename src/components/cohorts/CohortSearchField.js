import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import { CohortContext } from "./CohortProvider.js"
import { CohortResults } from "./CohortResults.js"
import "./CohortStudentList.css"

export const CohortSearchField = () => {
    const { findCohort, getCohort, activateCohort } = useContext(CohortContext)
    const { getCohortStudents } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [cohorts, setCohorts] = useState([])
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
        activateCohort(cohort.id)
        setTerms("")
    }, [])

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("activeCohort"))) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohort(id)
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

    return (
        <>
            <div className="search cohortAction">
                <input id="search__terms--cohort"
                    onKeyUp={search}
                    onChange={e => setTerms(e.target.value)}
                    value={terms}
                    ref={cohortSearch}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search cohorts"
                    aria-label="Search cohorts" />

                <CohortResults cohorts={cohorts} selectCohort={selectCohort} />
            </div>
        </>
    )
}
