
import React from "react"
import { Route } from "react-router-dom"
import { PeopleProvider } from "./people/PeopleProvider"
import { RecordEntryForm } from "./records/RecordEntryForm"
import { RecordForm } from "./records/RecordForm"
import { RecordList } from "./records/RecordList"
import { RecordProvider } from "./records/RecordProvider"

export const ApplicationViews = () => {
    return <>
        <main style={{
            margin: "2rem 2rem",
            lineHeight: "1.75rem"
        }}>
            <RecordProvider>
                <Route exact path="/">
                    <RecordList />
                </Route>

                <Route exact path="/records/new">
                    <PeopleProvider>
                        <RecordForm />
                    </PeopleProvider>
                </Route>

                <Route exact path="/record/:recordId/entries/new">
                    <RecordEntryForm />
                </Route>
            </RecordProvider>

        </main>
    </>
}
