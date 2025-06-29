import React from "react"
import { Route } from "react-router-dom"
import { AssessmentForm } from "./assessments/AssessmentForm"
import { AssessmentList } from "./assessments/AssessmentList"
import { AssessmentProvider } from "./assessments/AssessmentProvider"
import { CohortForm } from "./cohorts/CohortForm"
import { CohortProvider } from "./cohorts/CohortProvider"
import { CourseProvider } from "./course/CourseProvider"
import { FoundationsExerciseView } from "./dashboard/instructor/FoundationsExerciseView"
import { Dashboard } from "./dashboard/Dashboard"
import { FeedbackForm } from "./people/FeedbackForm"
import { PeopleProvider } from "./people/PeopleProvider"
import { CohortList } from "./cohorts/CohortList"
import { RecordProvider } from "./records/RecordProvider"
import { WeeklyTeams } from "./teams/WeeklyTeams"
import { ProjectForm } from "./course/ProjectForm"
import { BookForm } from "./course/BookForm"
import { CourseList } from "./course/CourseList"
import { CourseForm } from "./course/CourseForm"
import { CourseDetails } from "./course/CourseDetails.js"
import { BookDetails } from "./course/BookDetails.js"
import { ProjectDetails } from "./course/ProjectDetails.js"

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

                            <Route exact path="/courses">
                                <CourseList />
                            </Route>
                            <Route exact path="/courses/new">
                                <CourseForm />
                            </Route>
                            <Route exact path="/courses/edit/:courseId(\d+)">
                                <CourseForm />
                            </Route>
                            <Route exact path="/courses/:courseId(\d+)">
                                <CourseDetails />
                            </Route>

                            <Route exact path="/books/:bookId(\d+)">
                                <BookDetails />
                            </Route>
                            <Route exact path="/books/new/:courseId(\d+)">
                                <BookForm />
                            </Route>
                            <Route exact path="/books/edit/:bookId(\d+)">
                                <BookForm />
                            </Route>

                            <Route exact path="/projects/:projectId(\d+)">
                                <ProjectDetails />
                            </Route>
                            <Route exact path="/projects/edit/:projectId">
                                <ProjectForm />
                            </Route>
                            <Route exact path="/projects/new/:bookId(\d+)">
                                <ProjectForm />
                            </Route>


                            <Route exact path="/teams">
                                <WeeklyTeams />
                            </Route>

                            <Route exact path="/assessments/new">
                                <AssessmentForm />
                            </Route>

                            <Route exact path="/foundations">
                                <FoundationsExerciseView />
                            </Route>
                            <Route exact path="/assessments/edit/:assessmentId">
                                <AssessmentForm />
                            </Route>
                            <Route exact path="/assessments">
                                <AssessmentList />
                            </Route>

                            <Route exact path="/feedback/new">
                                <FeedbackForm />
                            </Route>

                            <Route exact path="/cohorts/new">
                                <CohortForm />
                            </Route>
                        </CourseProvider>
                    </PeopleProvider>
                </CohortProvider>
            </RecordProvider>
        </AssessmentProvider>
    </>
}
