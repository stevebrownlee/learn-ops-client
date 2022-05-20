import React from "react"
import { CohortSearch } from "../cohorts/CohortSearch"
import { StudentOverview } from "../people/StudentOverview"
import { StudentSearch } from "../people/StudentSearch"
import { DailyStatusDialog } from "./DailyStatusDialog"
import { FeedbackDialog } from "./FeedbackDialog"
import { CohortDialog } from "./CohortDialog"
import useModal from "../ui/useModal"
import "./Dashboard.css"

export const Dashboard = () => {
    let { toggleDialog: toggleCohorts } = useModal("#dialog--cohorts")

    return <main className="dashboard">
        <div className="dashboard__component dashboard__cohorts">
            <CohortSearch />
        </div>
        <div className="dashboard__component dashboard__students">
            <StudentSearch />
            <StudentOverview toggleCohorts={toggleCohorts} />
        </div>

        <DailyStatusDialog />
        <FeedbackDialog />
        <CohortDialog toggleCohorts={toggleCohorts} />
    </main>
}