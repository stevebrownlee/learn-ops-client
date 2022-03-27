import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentSearchResults } from "./StudentSearchResults.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import "./Search.css"

export const StudentSearch = () => {
    const { findStudent, getStudent } = useContext(PeopleContext)
    const [terms, setTerms] = useState("")
    const [students, setStudents] = useState([])

    const studentSearch = useRef()
    const searchLogger = useKeyboardShortcut('s', () => {
        studentSearch.current.focus()
    })

    useEffect(() => {
        if (terms !== "" && terms.length > 3) {
            findStudent(terms).then(setStudents)
        }
        else {
            setStudents([])
        }
    }, [terms, findStudent])

    useEffect(() => {
       document.addEventListener("keydown", searchLogger)
       return () => document.removeEventListener("keydown", searchLogger)
    }, [])

    const selectStudent = useCallback((student) => {
        getStudent(student.id)
        setTerms("")
        studentSearch.current.blur()
    }, [getStudent])

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
                    ref={studentSearch}
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
