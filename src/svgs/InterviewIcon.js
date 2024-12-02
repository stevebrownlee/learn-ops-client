import React from "react"
import { fetchIt } from "../components/utils/Fetch.js"
import Settings from "../components/Settings.js"

export const InterviewIcon = ({ text, setter, studentId }) => {

    return <svg
            style={{
                height: "1.2rem",
                position: "absolute",
                right: "1.3rem",
                bottom: "0"
            }}
            onClick={() => {
                setter(true)

                fetchIt(`${Settings.apiHost}/interviews`, {
                    method: "POST",
                    body: JSON.stringify({
                        student_id: studentId
                    })
                })
            }}
            className="svg"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <g fill="none"><path d="M7.5 2a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm7 7a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zm-3.195 1.023A2.025 2.025 0 0 0 11 10H4a2 2 0 0 0-2 2v1.5C2 15.554 4.088 17 7.5 17c.732 0 1.404-.067 2.006-.192A5.48 5.48 0 0 1 9 14.5c0-1.846.91-3.48 2.305-4.477zM10 14.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 0 0-9 0zm2.404 2.803l4.9-4.9a3.5 3.5 0 0 1-4.9 4.9zm-.707-.707a3.5 3.5 0 0 1 4.9-4.9l-4.9 4.9z" fill="currentColor"></path></g>
        </svg>
}