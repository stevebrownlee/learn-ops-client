import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import useKeyboardShortcut from "../ui/useKeyboardShortcut"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"

export const FeedbackDialog = ({ activeStudent }) => {
    const [message, setMessage] = useState("")

    const feedbackLogger = useKeyboardShortcut('f', ({ activeStudent }) => {
        if ("id" in activeStudent) {
            toggleFeedback()
            document.getElementById("feedbackText").focus()
            setMessage("")
        }
    }, { activeStudent })
    let { toggleDialog: toggleFeedback } = useModal("#dialog--feedback")

    useEffect(() => {
        document.addEventListener("keyup", feedbackLogger)

        return () => {
            document.removeEventListener("keyup", feedbackLogger)
        }
    }, [])



    return <dialog id="dialog--feedback" className="dialog--feedback">
        <div className="form-group">
            <label htmlFor="name">Feedback for student:</label>
            <input type="text" id="feedbackText"
                className="form-control form-control--dialog"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={
                    e => {
                        if (e.key === "Enter") {
                            if (e.target.value !== "") {
                                fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/feedback`, {
                                    method: "POST",
                                    body: JSON.stringify({ notes: e.target.value })
                                })
                                    .then(() => {
                                        setMessage("")
                                        toggleFeedback()
                                    })
                            }
                            else {
                                setMessage("")
                                toggleFeedback()
                            }
                        }
                        else if (e.key === "Escape") {
                            setMessage("")
                            toggleFeedback()
                        }
                    }
                } />
        </div>
    </dialog>
}