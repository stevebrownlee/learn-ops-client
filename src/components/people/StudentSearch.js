import React, { useContext, useEffect, useRef } from "react"
import { StandupContext } from "../dashboard/Dashboard.js"
import keyboardShortcut from "../ui/keyboardShortcut.js"
import "./Search.css"

export const StudentSearch = ({ setSearchTerms, searchTerms }) => {
    const { enteringNote } = useContext(StandupContext)

    const studentSearch = useRef()
    const enteringNoteStateRef = useRef(enteringNote)

    useEffect(() => {
        enteringNoteStateRef.current = enteringNote
    })

    const searchLogger = keyboardShortcut('s', 'l', () => {
        if (!enteringNoteStateRef.current) {
            studentSearch.current.focus()
        }
    })

    useEffect(() => {
        document.addEventListener("keyup", searchLogger)
        return () => document.removeEventListener("keyup", searchLogger)
    }, [])

    return (
        <>
            <div className="search cohortAction--large">
                <input id="search__terms"
                    type="search"
                    ref={studentSearch}
                    value={searchTerms}
                    onChange={e => setSearchTerms(e.target.value)}
                    className="form-control w-100"
                    placeholder="Search learners &amp; tags (s l)"
                    aria-label="Search learners &amp; tags" />
            </div>
        </>
    )
}
