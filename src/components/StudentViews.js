
import React from "react"
import { Route } from "react-router-dom"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { StudentDashboard } from "./dashboard/StudentDashboard"
import { GeneralInfo } from "./info/GeneralInfo"
import { Repos } from "./info/Repos"
import { PeopleProvider } from "./people/PeopleProvider"

export const StudentViews = () => {
    return <>
        <PeopleProvider>
            <Route exact path="/">
                <StudentDashboard />
            </Route>
            <Route exact path="/repos">
                <Repos />
            </Route>
            <Route exact path="/assessment">
                <GeneralInfo />
            </Route>
        </PeopleProvider>
    </>
}
