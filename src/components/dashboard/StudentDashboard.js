import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../auth/useSimpleAuth"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import MemberId from "./images/get-slack-member-id.gif"
import "./Dashboard.css"

export const StudentDashboard = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [user, setUser] = useState({})
    const history = useHistory()

    useEffect(() => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    const updatePersonality = (evt) => {
        fetchIt(`${Settings.apiHost}/students/${user.id}/status`, {
            method: "POST",
            body: JSON.stringify({ status: evt.target.value })
        })
    }

    return <article className="dashboard--student">
        <h1>Welcome {user.profile?.name}</h1>
        <div className="text--mini">This is your student dashboard where you can see all information about your cohort dates, notes from instructors, and general information about presentations, assessments, and shared projects.</div>

        <h2>Personality Info</h2>
        <div className="table table--smallPrompt">
            <div className="" >Briggs Myers</div>
            <div className="cell--centered">
                <input type="text" className="briggs__input"
                    id="briggsMyers" value={user.profile?.briggs}
                    onBlur={() => {
                        fetchIt()
                    }}
                    placeholder="e.g. ENTJ-A" />
            </div>
            <div className="" >Big Five</div>
            <div className="cell--centered">
                A: <input type="text" className="bfi__input"
                    id="bfi_agree" value={""} />

                N: <input type="text" className="bfi__input"
                    id="bfi_neuro" value={""} />

                C: <input type="text" className="bfi__input"
                    id="bfi_con" value={""} />

                O: <input type="text" className="bfi__input"
                    id="bfi_open" value={""} />

                E: <input type="text" className="bfi__input"
                    id="bfi_extra" value={""} />

            </div>
        </div>

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