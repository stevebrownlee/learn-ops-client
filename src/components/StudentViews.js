
import React from "react"
import { Route } from "react-router-dom"
import { Readme } from "./dashboard/Readme"
import { SlackMemberId } from "./dashboard/SlackMemberId"
import { StudentDashboard } from "./dashboard/StudentDashboard"
import { Assessment } from "./info/Assessment"
import { ClientAssessment } from "./info/ClientSideRequirements"
import { LearningGoals } from "./info/Goals"
import { Repos } from "./info/Repos"
import { ServerAssessment } from "./info/ServerSideRequirements"
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
            <Route exact path="/goals">
                <LearningGoals />
            </Route>
            <Route exact path="/assessment">
                <Assessment />
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
        </PeopleProvider>
    </>
}
