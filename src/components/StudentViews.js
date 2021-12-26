
import React from "react"
import { Route } from "react-router-dom"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { StudentDashboard } from "./dashboard/StudentDashboard"
import { PeopleProvider } from "./people/PeopleProvider"
import { StudentList } from "./people/StudentList"
import { RecordEntryForm } from "./records/RecordEntryForm"
import { RecordForm } from "./records/RecordForm"
import { RecordList } from "./records/RecordList"
import { RecordProvider } from "./records/RecordProvider"

export const StudentViews = () => {
    return <>
        <Route exact path="/">
            <StudentDashboard />
        </Route>

    </>
}
