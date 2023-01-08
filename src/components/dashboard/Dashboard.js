import React, { useContext, useEffect, useState } from "react"
import { FeedbackDialog } from "./FeedbackDialog"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { CourseContext } from "../course/CourseProvider"
import { StudentSearch } from "../people/StudentSearch"
import { useHistory } from "react-router-dom"
import "toaster-js/default.css"
import "./Dashboard.css"

export const Dashboard = () => {
    const { getLearningObjectives } = useContext(CourseContext)
    const [searchTerms, setSearchTerms] = useState([])
    const history = useHistory()

    useEffect(() => {
        getLearningObjectives()
    }, [])

    const viewWeeklyTeams = () => history.push("/teams")

    return <main className="dashboard">
        <section className="cohortActions">
            <CohortSearchField />
            <StudentSearch setSearchTerms={setSearchTerms} searchTerms={searchTerms} />
            <button className="fakeLink" onClick={viewWeeklyTeams}>Weekly Teams</button>
        </section>

        <StudentCardList searchTerms={searchTerms} />
        <FeedbackDialog />
    </main>
}
