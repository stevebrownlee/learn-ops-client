import React, { createContext, useState } from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import simpleAuth from "./auth/simpleAuth"
import { CohortProvider } from "./cohorts/CohortProvider"
import { Callback } from "./auth/Callback"
import { useLocation } from "react-router-dom"
import { StudentViews } from "./StudentViews"
import { StudentNavBar } from "./nav/StudentNavBar"

export const SettingsContext = createContext()


export const LearnOps = () => {
    const [mimic, changeMimic] = useState(false)
    const { isAuthenticated, getCurrentUser } = simpleAuth()
    const location = useLocation()

    return (
        <>
            <SettingsContext.Provider value={{
                mimic, changeMimic
            }}>
                <Route render={() => {
                    if (isAuthenticated()) {
                        const user = getCurrentUser()
                        const isStaff = user.profile?.staff

                        if (isStaff && !mimic) {
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
                    }
                    else {
                        if (location.pathname !== "/auth/github") {
                            return <Redirect to="/login" />
                        }
                    }
                }} />
            </SettingsContext.Provider>

            <Route path="/auth/github">
                <Callback />
            </Route>

            <Route path="/login">
                <Login />
            </Route>
        </>
    )
}