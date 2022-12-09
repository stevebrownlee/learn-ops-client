import React from "react"
import useModal from "../ui/useModal"
import { FeedbackDialog } from "./FeedbackDialog"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { CohortOperations } from "../cohorts/CohortOperations"
import "./Dashboard.css"

export const Dashboard = () => {
    return <main className="dashboard">
        {/* Immediately appear */}
        <header>
            <div className="titlebar">
                <h3>Find Cohort</h3>
            </div>
        </header>

        <section className="cohortActions">
            <CohortSearchField />
            <CohortOperations />
        </section>

        <StudentCardList />


        {/* Appear when needed */}
        <FeedbackDialog />
    </main>
}
