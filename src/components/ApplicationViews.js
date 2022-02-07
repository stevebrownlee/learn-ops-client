
import React from "react"
import { Route } from "react-router-dom"
import { AssessmentForm } from "./assessments/AssessmentForm"
import { AssessmentList } from "./assessments/AssessmentList"
import { AssessmentProvider } from "./assessments/AssessmentProvider"
import { CohortForm } from "./cohorts/CohortForm"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { FeedbackForm } from "./people/FeedbackForm"
import { PeopleProvider } from "./people/PeopleProvider"
import { StudentList } from "./people/StudentList"
import { RecordEntryForm } from "./records/RecordEntryForm"
import { RecordForm } from "./records/RecordForm"
import { RecordProvider } from "./records/RecordProvider"

export const ApplicationViews = () => {
    return <>
        <AssessmentProvider>
            <RecordProvider>
                <CohortProvider>
                    <PeopleProvider>
                        <Route exact path="/">
                            <Dashboard />
                        </Route>

                        <Route exact path="/students">
                            <StudentList />
                        </Route>
                        <Route exact path="/assessments">
                            <AssessmentList />
                            <AssessmentForm />
                        </Route>
                        <Route exact path="/feedback/new">
                            <FeedbackForm />
                        </Route>
                        <Route exact path="/cohorts/new">
                            <CohortForm />
                        </Route>
                        <Route exact path="/records/new/:studentId(\d+)">
                            <RecordForm />
                        </Route>
                        <Route exact path="/record/:recordId/entries/new">
                            <RecordEntryForm />
                        </Route>

                    </PeopleProvider>
                </CohortProvider>
            </RecordProvider>
        </AssessmentProvider>
    </>
}
