import React from "react"

export const CohortResults = ({ cohorts, selectCohort }) => {
    return (
        <article className={`search__results ${cohorts.length ? "" : "hidden"}`}>
            {
                cohorts.map(cohort => {
                    return <div key={`cohort--${cohort.id}`} className="cohort--results"
                        onClick={() => selectCohort(cohort)}
                    >
                        { cohort.name }
                    </div>
                })
            }
        </article >
    )
}
