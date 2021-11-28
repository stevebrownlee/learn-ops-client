import React from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import useSimpleAuth from "./auth/useSimpleAuth"
import { CohortProvider } from "./cohorts/CohortProvider"

export const LearnOps = () => {
    const { isAuthenticated } = useSimpleAuth()

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
                    return <Redirect to="/login" />
                }
            }} />

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