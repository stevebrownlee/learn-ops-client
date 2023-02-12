import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { FeedbackDialog } from "./FeedbackDialog"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { CourseContext } from "../course/CourseProvider"
import { StudentSearch } from "../people/StudentSearch"
import { EyeIcon } from "../../svgs/EyeIcon"
import "toaster-js/default.css"
import "./Dashboard.css"

export const Dashboard = () => {
    const { getLearningObjectives } = useContext(CourseContext)
    const [searchTerms, setSearchTerms] = useState([])
    const [showAllProjects, toggleAllProjects] = useState(false)
    const history = useHistory()

    useEffect(() => {
        getLearningObjectives()
    }, [])

    const viewWeeklyTeams = () => history.push("/teams")

    return <main className="dashboard">
        <section className="cohortActions">
            <CohortSearchField />
            <StudentSearch setSearchTerms={setSearchTerms} searchTerms={searchTerms} />
            <button className={`fakeLink toggle--projects ${showAllProjects ? "on" : "off"}`}
                onClick={() => toggleAllProjects(!showAllProjects) }>StandUp Mode</button>
            <button className="fakeLink" onClick={viewWeeklyTeams}>Weekly Teams</button>
        </section>

        <StudentCardList searchTerms={searchTerms} showAllProjects={showAllProjects} />
        <FeedbackDialog />


    </main>
}
