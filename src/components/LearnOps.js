import React from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import useSimpleAuth from "./auth/useSimpleAuth"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Callback } from "./auth/Callback"
import { useLocation } from "react-router-dom"
import { StudentViews } from "./StudentViews"
import { StudentNavBar } from "./nav/StudentNavBar"

export const LearnOps = () => {
    const { isAuthenticated, getCurrentUser } = useSimpleAuth()
    const location = useLocation()

    return (
        <>
            <Route render={() => {

                // Is authenticated
                if (isAuthenticated()) {
                    const user = getCurrentUser()

                    if (user.profile.staff) {
                        return <>
                            <NavBar />
                            <ApplicationViews />
                        </>
                    }
                    else {
                        return <>
                            <StudentNavBar />
                            <StudentViews />
                        </>
                    }

                // Not authenticated yet
                } else {
                    if (location.pathname !== "/auth/github") {
                        return <Redirect to="/login" />
                    }
                }
            }} />

            <Route path="/auth/github">
                <Callback />
            </Route>

            <Route path="/login">
                <Login />
            </Route>
        </>
    )
}