import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentResults } from "./StudentResults.js"

export const StudentSearch = () => {
    const history = useHistory()
    const { findStudent } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [students, setStudents] = useState([])

    useEffect(() => {
        if (terms !== "") {
            findStudent(terms).then(setStudents)
        }
    }, [terms])

    const search = (e) => {
        if (e.keyCode === 13) {
            if (students.length === 1) {
                console.log(students[0])
            }
        }
    }

    return (
        <>
            <header>
                <div className="titlebar">
                    <h1>Find Student</h1>
                </div>
                <input id="searchTerms"
                        onKeyUp={search}
                        onChange={e => {
                            setTerms(e.target.value)
                        }}
                        value={terms}
                        className="form-control w-100"
                        type="search"
                        placeholder="Search"
                        aria-label="Search" />
            </header>

            <StudentResults students={students} />
        </>
    )
}
