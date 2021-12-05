import React from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import useSimpleAuth from "./auth/useSimpleAuth"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Callback } from "./auth/Callback"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

export const LearnOps = () => {
    const { isAuthenticated } = useSimpleAuth()
    const location = useLocation()
    console.log(location)

    return (
        <>
            <Route render={() => {
                if (isAuthenticated()) {
                    return <>
                        <Route>
                            <NavBar />
                            <ApplicationViews />
                        </Route>
                    </>
                } else {
                    if (location.pathname === "/auth/github") {
                        return <Route path="/auth/github?code=:accessCode">
                            <Callback />
                        </Route>
                    }
                    return <Redirect to="/login" />
                }
            }} />

            <Route path="/auth/github">
                <Callback />
            </Route>

            <Route path="/login">
                <Login />
            </Route>

            <CohortProvider>
                <Route path="/register">
                    <Register />
                </Route>
            </CohortProvider>

        </>
    )
}