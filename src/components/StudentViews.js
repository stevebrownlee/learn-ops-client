
import React from "react"
import { Route } from "react-router-dom"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { StudentDashboard } from "./dashboard/StudentDashboard"
import { PeopleProvider } from "./people/PeopleProvider"

export const StudentViews = () => {
    return <>
        <PeopleProvider>
            <Route exact path="/">
                <StudentDashboard />
            </Route>
        </PeopleProvider>
    </>
}
