import React, { useCallback, useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentSearchResults } from "./StudentSearchResults.js"
import "./Search.css"

export const StudentSearch = () => {
    const { findStudent, getStudent } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [students, setStudents] = useState([])

    useEffect(() => {
        if (terms !== "" && terms.length > 3) {
            findStudent(terms).then(setStudents)
        }
        else {
            setStudents([])
        }
    }, [terms, findStudent])

    // useEffect(() => {
    //    document.addEventListener("keypress", handleSearchKey)

    //    return () => document.removeEventListener("keypress",handleSearchKey)
    // }, [])

    const handleSearchKey = (evt) => {
        if (evt.keyCode === 47) {
            evt.preventDefault()
            document.getElementById("search__terms").focus()
        }
    }

    const selectStudent = useCallback((student) => {
        getStudent(student.id)
        setTerms("")
    }, [getStudent ])

    const search = (e) => {
        if (e.keyCode === 13) {
            if (students.length === 1) {
                selectStudent(students[0])
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
                    onChange={e => setTerms(e.target.value)}
                    value={terms}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search"
                    aria-label="Search" />

                <StudentSearchResults students={students} selectStudent={selectStudent} />
            </div>
        </>
    )
}
