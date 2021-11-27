import React from "react"
import { StudentOverview } from "../people/StudentOverview"
import { StudentSearch } from "../people/StudentSearch"

export const Dashboard = () => {
    return <>
        <StudentSearch />
        <StudentOverview />
    </>
}