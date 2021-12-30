import React, { useEffect, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./Dashboard.css"

export const StudentDashboard = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [ user, setUser ] = useState({})

    useEffect(() => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    return <article className="dashboard--student">
        <h2>Welcome {user.profile?.name}</h2>
        <div className="text--mini">This is your student dashboard where you can see all information about your cohort dates, notes from instructors, and general information about presentations, assessments, and shared projects.</div>

        {
            user.profile?.cohorts.map(cohort => {
                return <p key={`cohort--${cohort.id}`}>You are in {cohort.name} which starts on {new Date(cohort.start_date).toLocaleDateString()} and ends on {new Date(cohort.end_date).toLocaleDateString()}</p>
            })
        }

        <details>
            <summary>Notes from your instruction team</summary>
            {
                user.profile?.feedback.map(f => {
                    return <div className="feedback" key={`feedback--${f.id}`}>
                        <div>{f.notes}</div>
                        <div className="feedback__author">By {f.author} on {new Date(f.session_date).toLocaleDateString()}</div>
                    </div>
                })
            }
        </details>
    </article>
}