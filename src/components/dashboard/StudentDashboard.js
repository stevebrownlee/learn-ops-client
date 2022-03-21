import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./Dashboard.css"
import MemberId from "./images/get-slack-member-id.gif"

export const StudentDashboard = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [user, setUser] = useState({})
    const history = useHistory()

    useEffect(() => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    return <article className="dashboard--student">
        <h1>Welcome {user.profile?.name}</h1>
        <div className="text--mini">This is your student dashboard where you can see all information about your cohort dates, notes from instructors, and general information about presentations, assessments, and shared projects.</div>

        <h2>General Info</h2>
        <div className="table table--smallPrompt">
            <div className="" >Cohort</div>
            <div className="cell--centered">
                {
                    user.profile?.cohorts.length
                        ? user.profile?.cohorts.map(cohort => {
                            return <div key={`cohort--${cohort.id}`}>{cohort.name} {" "}
                                <span className="text--mini">[{new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}]</span>
                            </div>
                        })
                        : "Unassigned"
                }
            </div>
            <div className="" >Github Id</div>
            <div className="cell--centered">{user.profile?.github}</div>
            <div className="" >Slack Id</div>
            <div className="cell--centered">{user.profile?.slack_handle} <button
                onClick={() => history.push("/slackUpdate")}
                className="fakeLink">Update</button></div>
        </div>

        <h2>Notes from instructors</h2>
        <div className="feedback">
            {
                user.profile?.feedback.length
                    ? user.profile?.feedback.map(f => {
                        return <div className="feedback" key={`feedback--${f.id}`}>
                            <div>{f.notes}</div>
                            <div className="feedback__author">By {f.author} on {new Date(f.session_date).toLocaleDateString()}</div>
                        </div>
                    })
                    : "None yet"
            }
        </div>
    </article>
}