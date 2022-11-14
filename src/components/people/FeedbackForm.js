import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"


export const FeedbackForm = () => {
    const [feedback, changeFeedback] = useState({
        text: "",
        studentId: 0
    })
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        const updateStudent = (location) => {
            const copy = { ...feedback }
            copy.studentId = location?.state?.studentId
            changeFeedback(copy)
        }

        updateStudent(location)

    }, [location])

    const sendFeedback = () => {
        fetchIt(`${Settings.apiHost}/students/${feedback.studentId}/status`, {
            method: "POST",
            body: JSON.stringify({
                notes: feedback.text
            })
        })
            .then(() => history.push("/"))
    }

    const handleUserInput = (event) => {
        const copy = {...feedback}
        copy[event.target.id] = event.target.value
        changeFeedback(copy)
    }


    return (
        <>
            <form className="cohortForm view">
                <h2 className="cohortForm__title">Send Feedback to Student</h2>
                <div className="form-group">
                    <input onChange={handleUserInput}
                        value={feedback.text}
                        type="text" required autoFocus
                        placeholder="Add feedback here..."
                        id="text" className="form-control"
                    />
                </div>

                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            sendFeedback()
                        }
                    }
                    className="btn btn-primary"> Send </button>
            </form>
        </>
    )
}
