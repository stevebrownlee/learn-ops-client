import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CohortContext } from "./CohortProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { Cohort } from "./Cohort"
import { CohortDetails } from "./CohortDetails"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./CohortList.css"
import "./Cohort.css"
import { Button } from "@radix-ui/themes"


export const CohortList = () => {
    const [editSlack, setSlackEdit] = useState(0)
    const [showActive, setShowActive] = useState(true)
    const { getStudents } = useContext(PeopleContext)
    const {
        getCohorts, cohorts, leaveCohort,
        joinCohort, updateCohort, activateCohort
    } = useContext(CohortContext)
    const history = useHistory()

    useEffect(() => {
        getRecentCohorts()
    }, [showActive])

    const getRecentCohorts = () => getCohorts({ limit: 12, active: showActive })

    return <>
        <header className="cohorts__header" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Button  onClick={() => history.push("/cohorts/new")}>Create Cohort</Button>
            <Button color={showActive ? "brown" : "gold"} onClick={() => setShowActive(!showActive)}>{showActive ? "Show Previous 12" : "Show Active"} Cohorts</Button>
        </header>
        <div className="cohorts">
            {
                cohorts.map(cohort => <Cohort
                    key={`cohort--${cohort.id}`}
                    cohort={cohort}
                    getRecentCohorts={getRecentCohorts} />)
            }
        </div>

        <CohortDetails />
    </>
}
