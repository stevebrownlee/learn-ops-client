import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../../auth/useSimpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import { GithubIcon } from "../../../svgs/GithubIcon.js"
import { CohortInfo } from "./CohortInfo.js"
import { StudentInfo } from "./StudentInfo.js"
import "../Dashboard.css"

export const StudentDashboard = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [user, setUser] = useState({})
    // eslint-disable-next-line
    const [briggs, setBriggs] = useState("")

    const history = useHistory()

    useEffect(() => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    return <main>
        <header className="studentDashboard__header">
            <h1>Welcome {user.profile?.name}</h1>
        </header>
        <article className="dashboard--overview">
            <CohortInfo profile={user.profile} />
            <StudentInfo profile={user.profile} />
        </article>
    </main>
}
