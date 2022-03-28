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
import { FeedbackDialog } from "./FeedbackDialog"

export const Dashboard = () => {
    const { activeStudent } = useContext(PeopleContext)
    const initialMessagesState = {
        status: ""
    }
    const [ messages, setMessages ] = useState(initialMessagesState)

    const dailyStatusLogger = useKeyboardShortcut('d', ({ activeStudent }) => {
        if ("id" in activeStudent) {
            toggleStatus()
            document.getElementById("statusText").focus()
            setMessages(initialMessagesState)
        }
    }, { activeStudent })

    let { toggleDialog: toggleStatus } = useModal("#dialog--status")

    useEffect(() => {
        document.addEventListener("keyup", dailyStatusLogger)

        return () => {
            document.removeEventListener("keyup", dailyStatusLogger)
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
                                    toggleStatus()
                                }
                            }
                            else if (e.key === "Escape") {
                                toggleStatus()
                            }
                        }
                    }
                />
            </div>
        </dialog>

        <FeedbackDialog activeStudent={activeStudent} />
    </main>
}