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
    const { getStudents } = useContext(PeopleContext)
    const {
        getCohorts, cohorts, leaveCohort,
        joinCohort, updateCohort, activateCohort
    } = useContext(CohortContext)
    const history = useHistory()

    useEffect(() => {
        getRecentCohorts()
    }, [])

    const getRecentCohorts = () => getCohorts({ limit: 12 })

    return <>
        <header className="cohorts__header">
            <Button className="" onClick={() => history.push("/cohorts/new")}>Create Cohort</Button>
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
