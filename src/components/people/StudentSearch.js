import React, { useEffect, useRef } from "react"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import "./Search.css"

export const StudentSearch = ({ setSearchTerms, searchTerms }) => {
    const studentSearch = useRef()
    const searchLogger = useKeyboardShortcut('s', 'l', () => studentSearch.current.focus())

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
