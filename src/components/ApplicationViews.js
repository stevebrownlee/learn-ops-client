
import React from "react"
import { Route } from "react-router-dom"
import { RecordList } from "./records/RecordList"
import { RecordProvider } from "./records/RecordProvider"

export const ApplicationViews = () => {
    return <>
        <main style={{
            margin: "2rem 2rem",
            lineHeight: "1.75rem"
        }}>
            <Route exact path="/">
                <RecordProvider>
                    <RecordList />
                </RecordProvider>
            </Route>

        </main>
    </>
}
