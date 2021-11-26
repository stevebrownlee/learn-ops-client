
import React from "react"
import { Route } from "react-router-dom"
import { PeopleProvider } from "./people/PeopleProvider"
import { StudentSearch } from "./people/StudentSearch"
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
                <Route exact path="/records">
                    <RecordList />
                </Route>

                <PeopleProvider>
                    <Route exact path="/records/new">
                        <RecordForm />
                    </Route>
                    <Route exact path="/">
                        <StudentSearch />
                    </Route>
                </PeopleProvider>

                <Route exact path="/record/:recordId/entries/new">
                    <RecordEntryForm />
                </Route>
            </RecordProvider>

        </main>
    </>
}
