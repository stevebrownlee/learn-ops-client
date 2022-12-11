import React, { useEffect, useRef } from "react"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import "./Search.css"

export const StudentSearch = ({ setSearchTerms, searchTerms }) => {
    const studentSearch = useRef()
    const searchLogger = useKeyboardShortcut('s', () => studentSearch.current.focus())

    useEffect(() => {
        document.addEventListener("keyup", searchLogger)
        return () => document.removeEventListener("keyup", searchLogger)
    }, [])

    return (
        <>
            <div className="search cohortAction--large">
                <input id="search__terms"
                    ref={studentSearch}
                    onChange={e => setSearchTerms(e.target.value)}
                    value={searchTerms}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search students &amp; tags"
                    aria-label="Search students &amp; tags" />
            </div>
        </>
    )
}
