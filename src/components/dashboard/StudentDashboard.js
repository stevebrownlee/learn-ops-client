import React from "react"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./Dashboard.css"

export const StudentDashboard = () => {
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()


    return <article className="dashboard--student">
        <h2>Welcome {user.profile.name}</h2>
        <div className="text--mini">This is your student dashboard where you can see all information about your cohort dates, notes from instructors, and general information about presentations, assessments, and shared projects.</div>

        <p>You are in {user.profile.cohorts[0].name} which starts on {new Date(user.profile.cohorts[0].start_date).toLocaleDateString()} and ends on {new Date(user.profile.cohorts[0].end_date).toLocaleDateString()}</p>

        <details>
            <summary>Notes from your instruction team</summary>
            {
                user.profile.feedback.map(f => {
                    return <div className="feedback" key={`feedback--${f.id}`}>
                        <div>{f.notes}</div>
                        <div className="feedback__author">By {f.author} on {new Date(f.session_date).toLocaleDateString()}</div>
                    </div>
                })
            }
        </details>
    </article>
}