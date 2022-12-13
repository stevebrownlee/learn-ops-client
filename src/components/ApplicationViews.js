
import React from "react"
import { Route } from "react-router-dom"
import { AssessmentForm } from "./assessments/AssessmentForm"
import { AssessmentList } from "./assessments/AssessmentList"
import { AssessmentProvider } from "./assessments/AssessmentProvider"
import { CohortForm } from "./cohorts/CohortForm"
import { CohortProvider } from "./cohorts/CohortProvider"
import { CourseProvider } from "./course/CourseProvider"
import { Dashboard } from "./dashboard/Dashboard"
import { FeedbackForm } from "./people/FeedbackForm"
import { PeopleProvider } from "./people/PeopleProvider"
import { CohortList } from "./cohorts/CohortList"
import { RecordEntryForm } from "./records/RecordEntryForm"
import { RecordForm } from "./records/RecordForm"
import { RecordProvider } from "./records/RecordProvider"
import { WeeklyTeams } from "./teams/WeeklyTeams"
import { ProjectList } from "./course/ProjectList"

export const ApplicationViews = () => {
    return <>
        <AssessmentProvider>
            <RecordProvider>
                <CohortProvider>
                    <PeopleProvider>
                        <CourseProvider>
                            <Route exact path="/">
                                <Dashboard />
                            </Route>

                            <Route exact path="/cohorts">
                                <CohortList />
                            </Route>

                            <Route exact path="/projects">
                                <ProjectList />
                            </Route>
                            <Route exact path="/projects/new">
                                <CohortForm />
                            </Route>


                            <Route exact path="/teams">
                                <WeeklyTeams />
                            </Route>

                            <Route exact path="/assessments">
                                <article className="assessmentView">
                                    <AssessmentForm />
                                    <AssessmentList />
                                </article>
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

                            <Route exact path="/cohorts/new">
                                <CohortForm />
                            </Route>

                            <Route exact path="/records/new/:studentId(\d+)">
                                <RecordForm />
                            </Route>

                            <Route exact path="/record/:recordId/entries/new">
                                <RecordEntryForm />
                            </Route>
                        </CourseProvider>
                    </PeopleProvider>
                </CohortProvider>
            </RecordProvider>
        </AssessmentProvider>
    </>
}
