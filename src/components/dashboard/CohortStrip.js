import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { CohortContext } from "../cohorts/CohortProvider"

export const ActiveCohortStrip = () => {
    const { getCohorts, cohorts, activateCohort, activeCohort } = useContext(CohortContext)

    useEffect(() => {
        getCohorts({ active: true })
    }, [])

    return <section className="active_cohorts">
        <ul className="active_cohorts__list">
            {
                cohorts.map(cohort => {
                    return <li key={cohort.id}
                               className={`fakeLink small active_cohorts__cohort ${activeCohort === cohort.id ? "activeLink" : ""}`} >
                        <span onClick={e => activateCohort(cohort.id)}>{cohort.name}</span>
                    </li>
                })
            }
        </ul>
    </section>
}
