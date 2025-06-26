import React from "react"
import { Route, Redirect } from "react-router-dom"
import { NavBar } from "./nav/NavBar"
import { ApplicationViews } from "./ApplicationViews"
import { StaffNavBar } from "./nav/StaffNavBar"
import { StaffViews } from "./StaffViews"
import { Login } from "./auth/Login"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Callback } from "./auth/Callback"
import { useLocation } from "react-router-dom"
import { StudentViews } from "./StudentViews"
import { StudentNavBar } from "./nav/StudentNavBar"
import simpleAuth from "./auth/simpleAuth"
import { SettingsProvider } from "./providers/SettingsProvider"
import { useSettings } from "../hooks/useSettings"


// Create a component that uses the settings
const AuthenticatedRoutes = () => {
    const { mimic } = useSettings()
    const { isAuthenticated, getCurrentUser } = simpleAuth()

    if (isAuthenticated()) {
        const user = getCurrentUser()
        const isStaff = user.profile?.staff
        const isInstructor = user.profile?.instructor

        if (isInstructor && !mimic) {
            return <>
                <NavBar />
                <ApplicationViews />
            </>
        }
        else if (mimic || (!isStaff && !isInstructor)) {
            return <>
                <StudentNavBar />
                <StudentViews />
            </>
        }
        else if (isStaff) {
            return <>
                <StaffNavBar />
                <StaffViews />
            </>
        }
        return <h1>Loading...</h1>
    }
    else {
        return null
    }
}

export const LearnOps = () => {
    const { isAuthenticated } = simpleAuth()
    const location = useLocation()

    return (
        <>
            <SettingsProvider>
                <Route render={() => {
                    if (isAuthenticated()) {
                        return <AuthenticatedRoutes />
                    }
                    else {
                        if (location.pathname !== "/auth/github") {
                            return <Redirect to="/login" />
                        }
                        return null
                    }
                }} />
            </SettingsProvider>

            <Route path="/auth/github">
                <Callback />
            </Route>

            <Route path="/login">
                <Login />
            </Route>
        </>
    )
}