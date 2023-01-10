import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CohortContext } from "./CohortProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { Cohort } from "./Cohort"
import { CohortDetails } from "./CohortDetails"
import { UnassignedStudents } from "./UnassignedStudents"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./CohortList.css"
import "./Cohort.css"


export const CohortList = () => {
    const [editSlack, setSlackEdit] = useState(0)
    const { getStudents } = useContext(PeopleContext)
    const {
        getCohorts, cohorts, leaveCohort,
        joinCohort, updateCohort, activateCohort
    } = useContext(CohortContext)
    const history = useHistory()

    useEffect(() => {
        getStudents("unassigned")
        getLastFourCohorts()
    }, [])

    const getLastFourCohorts = () => getCohorts({ limit: 6 })

    return <>
        <button className="button button--isi button--border-thick button--round-l button--size-s studentList__createCohort"
            onClick={() => history.push("/cohorts/new")}>
            <i className="button__icon icon icon-book"></i>
            <span>Create Cohort</span>
        </button>
        <div className="cohorts">
            {
                cohorts.map(cohort => <Cohort
                    key={`cohort--${cohort.id}`}
                    cohort={cohort}
                    getLastFourCohorts={getLastFourCohorts} />)
            }
        </div>

        <UnassignedStudents getLastFourCohorts={getLastFourCohorts} />
        <CohortDetails />
    </>
}
