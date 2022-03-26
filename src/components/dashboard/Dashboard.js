import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { CohortSearch } from "../cohorts/CohortSearch"
import { PeopleContext } from "../people/PeopleProvider"
import { StudentOverview } from "../people/StudentOverview"
import { StudentSearch } from "../people/StudentSearch"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./Dashboard.css"

export const Dashboard = () => {
    const [keyBuffer, updateKeyBuffer] = useState([])
    const [currentKey, updateCurrentKey] = useState('')
    const { activeStudent } = useContext(PeopleContext)
    let { toggleDialog: toggleStatus } = useModal("#dialog--status")
    let { toggleDialog: toggleFeedback } = useModal("#dialog--feedback")
    const dailyStatus = useRef()
    const feedback = useRef()

    const acceptedKeys = new Set(['\\', 'n', 'd', 'f', 'a'])

    const shortcutKeyBuffer = useCallback((e) => {
        if (acceptedKeys.has(e.key)) {
            updateCurrentKey(e.key)
        }
    }, [])

    useEffect(() => {
        if (acceptedKeys.has(currentKey)) {
            if (currentKey === "\\") {
                updateKeyBuffer([currentKey])
            }
            else if (keyBuffer.length === 1) {
                const copy = [...keyBuffer]
                copy.push(currentKey)
                updateKeyBuffer(copy)
            }
            else if (keyBuffer.length === 2) {
                updateKeyBuffer([])
            }
            updateCurrentKey('')
        }
    }, [currentKey])

    useEffect(() => {
        if (keyBuffer.length === 2) {
            switch (keyBuffer[1]) {
                case 'd':
                    toggleStatus()
                    dailyStatus.current.focus()
                    break;
                case 'f':
                    toggleFeedback()
                    feedback.current.focus()
                    break;
            }
            updateKeyBuffer([])

        }
    }, [keyBuffer])

    useEffect(() => {
        document.addEventListener("keydown", shortcutKeyBuffer)

        return () => document.removeEventListener("keydown", shortcutKeyBuffer)
    }, [])



    return <main className="dashboard">
        <div className="dashboard__component dashboard__cohorts">
            <CohortSearch />
        </div>
        <div className="dashboard__component dashboard__students">
            <StudentSearch />
            <StudentOverview />
        </div>


        <dialog id="dialog--status" className="dialog--status">
            <div className="form-group">
                <label htmlFor="name">Daily status:</label>
                <input ref={dailyStatus} onKeyPress={
                    e => {
                        if (e.key === "Enter" && e.target.value !== "") {
                            console.log(activeStudent)
                            toggleStatus()
                        }
                    }
                }
                    type="text" required autoFocus
                    id="status" className="form-control form-control--dialog"
                />
            </div>
        </dialog>

        <dialog id="dialog--feedback" className="dialog--feedback">
            <div className="form-group">
                <label htmlFor="name">Feedback for student:</label>
                <input ref={feedback} onKeyPress={
                    e => {
                        if (e.key === "Enter" && e.target.value !== "") {
                            fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/status`, {
                                method: "POST",
                                body: JSON.stringify({ notes: e.target.value })
                            })
                                .then(() => {
                                    toggleFeedback()
                                })


                        }
                    }
                }
                    type="text" required autoFocus
                    id="status" className="form-control form-control--dialog"
                />
            </div>
        </dialog>
    </main>
}