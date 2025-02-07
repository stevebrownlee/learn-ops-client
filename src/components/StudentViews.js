import React from "react"
import { Route } from "react-router-dom"
import { AssessmentProvider } from "./assessments/AssessmentProvider"
import { PeopleProvider } from "./people/PeopleProvider"
import { Readme } from "./dashboard/student/Readme"
import { SlackMemberId } from "./dashboard/student/SlackMemberId"
import { Assessment } from "./info/Assessment"
import { ClientProposal } from "./info/ClientProposal"
import { ClientAssessment } from "./info/ClientSideRequirements"
import { LearningGoals } from "./info/Goals"
import { ServerAssessment } from "./info/ServerSideRequirements"
import { StudentDashboard } from "./dashboard/student/StudentDashboard"
import { Query } from "./Query"

export const StudentViews = () => {
    return <>
        <PeopleProvider>
            <AssessmentProvider>
                <Route exact path="/">
                    <StudentDashboard />
                </Route>
                <Route exact path="/query">
                    <Query />
                </Route>
                <Route exact path="/goals">
                    <LearningGoals />
                </Route>
                <Route exact path="/assessment">
                    <Assessment />
                </Route>
                <Route exact path="/proposal/client">
                    <ClientProposal />
                </Route>
                <Route exact path="/assessment/server">
                    <ServerAssessment />
                </Route>
                <Route exact path="/assessment/client">
                    <ClientAssessment />
                </Route>
                <Route exact path="/slackUpdate">
                    <SlackMemberId />
                </Route>
                <Route exact path="/readme">
                    <Readme />
                </Route>
            </AssessmentProvider>
        </PeopleProvider>
    </>
}
