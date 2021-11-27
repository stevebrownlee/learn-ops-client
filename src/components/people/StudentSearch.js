import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentResults } from "./StudentResults.js"
import "./Search.css"

export const StudentSearch = () => {
    const history = useHistory()
    const { findStudent, getStudent } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [students, setStudents] = useState([])

    useEffect(() => {
        if (terms !== "") {
            findStudent(terms).then(setStudents)
        }
        else {
            setStudents([])
        }
    }, [terms])

    const search = (e) => {
        if (e.keyCode === 13) {
            if (students.length === 1) {
                getStudent(students[0].id)
                setTerms("")
            }
        }
    }

    return (
        <>
            <header>
                <div className="titlebar">
                    <h3>Find Student</h3>
                </div>
            </header>
            <div className="search">
                <input id="search__terms"
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

                <StudentResults students={students} setTerms={setTerms} />
            </div>
        </>
    )
}
