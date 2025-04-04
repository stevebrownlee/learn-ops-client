import React from "react"
import { Route } from "react-router-dom"
import { FoundationsExerciseView } from "./dashboard/instructor/FoundationsExerciseView"
import { PeopleProvider } from "./people/PeopleProvider"

export const StaffViews = () => {
    return <>
        <PeopleProvider>
            <Route exact path="/">
                <FoundationsExerciseView />
            </Route>
        </PeopleProvider>
    </>
}
