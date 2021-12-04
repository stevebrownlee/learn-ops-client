
import React from "react"
import { Route } from "react-router-dom"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { PeopleProvider } from "./people/PeopleProvider"
import { RecordEntryForm } from "./records/RecordEntryForm"
import { RecordForm } from "./records/RecordForm"
import { RecordList } from "./records/RecordList"
import { RecordProvider } from "./records/RecordProvider"

export const ApplicationViews = () => {
    return <>
        <RecordProvider>
            <CohortProvider>
                <PeopleProvider>
                    <Route exact path="/">
                        <Dashboard />
                    </Route>

                    <Route exact path="/records">
                        <RecordList />
                    </Route>
                    <Route exact path="/records/new">
                        <RecordForm />
                    </Route>
                    <Route exact path="/record/:recordId/entries/new">
                        <RecordEntryForm />
                    </Route>

                </PeopleProvider>
            </CohortProvider>
        </RecordProvider>
    </>
}
