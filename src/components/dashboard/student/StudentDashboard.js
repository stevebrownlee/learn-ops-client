import React, { useContext, useEffect, useState } from "react"
import { Button } from "@radix-ui/themes"
import { useHistory } from "react-router-dom"

import simpleAuth from "../../auth/simpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import { GithubIcon } from "../../../svgs/GithubIcon.js"
import { CohortInfo } from "./CohortInfo.js"
import { StudentInfo } from "./StudentInfo.js"
import { SettingsContext } from "../../LearnOps.js"
import "../Dashboard.css"

export const StudentDashboard = () => {
    const { mimic } = useContext(SettingsContext)
    const { getCurrentUser, getProfile } = simpleAuth()
    const [user, setUser] = useState({})
    // eslint-disable-next-line
    const [briggs, setBriggs] = useState("")

    const history = useHistory()

    useEffect(() => {
        getProfile(null, null, null, mimic).then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    return <main>
        {
            user.profile?.github_org_status === "active"
                ? <article className="dashboard--overview">
                    <CohortInfo profile={user.profile} />
                    <StudentInfo profile={user.profile} />
                </article>
                : <article style={{
                    margin: 0,
                    padding: "10rem 0 0 0",
                    height: "100%", /* Ensures that the body takes the full viewport height */
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start", /* Centers horizontally */
                    alignItems: "center", /* Centers vertically */
                }}>
                    <h2>You need to accept the invitation to join your cohort's GitHub organization</h2>
                    <div>Click the button below to visit Github. Accept the invitation, and then come back to this tab and refresh.</div>
                    <Button style={{ marginTop: "2rem" }}>
                        <a style={{ color: "white", textDecoration: "none"}} href={user.profile?.current_cohort?.github_org} target="_blank">Accept Now</a>
                    </Button>
                </article>
        }
    </main>
}
