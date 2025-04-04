import React, { createContext, useState } from "react"
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
                        const isInstructor = user.profile?.instructor

                        if (isInstructor && !mimic) {
                            return <>
                                <NavBar />
                                <ApplicationViews />
                            </>
                        }
                        else if (isStaff) {
                            return <>
                                <StaffNavBar />
                                <StaffViews />
                            </>
                        }
                        else if (mimic || (!isStaff && !isInstructor)) {
                            return <>
                                <StudentNavBar />
                                <StudentViews />
                            </>
                        }
                        return <h1>Loading...</h1>
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