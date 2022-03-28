import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { CohortSearch } from "../cohorts/CohortSearch"
import { PeopleContext } from "../people/PeopleProvider"
import { StudentOverview } from "../people/StudentOverview"
import { StudentSearch } from "../people/StudentSearch"
import Settings from "../Settings"
import useKeyboardShortcut from "../ui/useKeyboardShortcut"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./Dashboard.css"

export const Dashboard = () => {
    const { activeStudent } = useContext(PeopleContext)
    const initialMessagesState = {
        feedback: "",
        status: ""
    }
    const [ messages, setMessages ] = useState(initialMessagesState)

    const feedbackLogger = useKeyboardShortcut('f', () => {
        if ("id" in activeStudent) {
            toggleFeedback()
            document.getElementById("feedbackText").focus()
            setMessages(initialMessagesState)
        }
    })

    const dailyStatusLogger = useKeyboardShortcut('d', () => {
        if ("id" in activeStudent) {
            toggleStatus()
            document.getElementById("statusText").focus()
            setMessages(initialMessagesState)
        }
    })

    let { toggleDialog: toggleStatus } = useModal("#dialog--status")
    let { toggleDialog: toggleFeedback } = useModal("#dialog--feedback")

    useEffect(() => {
        document.addEventListener("keydown", feedbackLogger)
        document.addEventListener("keydown", dailyStatusLogger)

        return () => {
            document.removeEventListener("keydown", feedbackLogger)
            document.removeEventListener("keydown", dailyStatusLogger)
        }
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
                <input type="text" id="statusText"
                    className="form-control form-control--dialog"
                    value={messages.status}
                    onChange={(e) => {
                        const copy = {...messages}
                        copy.status = e.target.value
                        setMessages(copy)
                    }}
                    onKeyDown={
                        e => {
                            if (e.key === "Enter") {
                                if (e.target.value !== "") {
                                    fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/status`, {
                                        method: "POST",
                                        body: JSON.stringify({ status: e.target.value })
                                    })
                                        .then(toggleStatus)
                                }
                                else {
                                    toggleFeedback()
                                }
                            }
                            else if (e.key === "Escape") {
                                toggleFeedback()
                            }
                        }
                    }
                />
            </div>
        </dialog>

        <dialog id="dialog--feedback" className="dialog--feedback">
            <div className="form-group">
                <label htmlFor="name">Feedback for student:</label>
                <input type="text" id="feedbackText"
                    className="form-control form-control--dialog"
                    value={messages.feedback}
                    onChange={(e) => {
                        const copy = {...messages}
                        copy.feedback = e.target.value
                        setMessages(copy)
                    }}
                    onKeyDown={
                        e => {
                            if (e.key === "Enter") {
                                if (e.target.value !== "") {
                                    fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/feedback`, {
                                        method: "POST",
                                        body: JSON.stringify({ notes: e.target.value })
                                    })
                                        .then(() => {
                                            toggleFeedback()
                                        })
                                }
                                else {
                                    toggleFeedback()
                                }
                            }
                            else if (e.key === "Escape") {
                                toggleFeedback()
                            }
                        }
                    } />
            </div>
        </dialog>
    </main>
}