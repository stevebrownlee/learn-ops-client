import React from "react"
import { StudentOverview } from "../people/StudentOverview"
import { StudentSearch } from "../people/StudentSearch"
import { DailyStatusDialog } from "./DailyStatusDialog"
import { FeedbackDialog } from "./FeedbackDialog"
import { CohortDialog } from "./CohortDialog"
import { StudentCardList } from "../cohorts/StudentCardList"
import useModal from "../ui/useModal"
import "./Dashboard.css"
import { CohortSearchField } from "../cohorts/CohortSearchField"

export const Dashboard = () => {
    let { toggleDialog: toggleCohorts } = useModal("#dialog--cohorts")

    return <main className="dashboard">
        {/* Immediately appear */}
        <CohortSearchField />
        <StudentCardList />




        {/* Appear when needed */}
        <DailyStatusDialog />
        <FeedbackDialog />
        <CohortDialog toggleCohorts={toggleCohorts} />
    </main>
}