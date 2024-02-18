import React, { useContext, useEffect, useState } from "react"
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
        <article className="dashboard--overview">
            <CohortInfo profile={user.profile} />
            <StudentInfo profile={user.profile} />
        </article>
    </main>
}
