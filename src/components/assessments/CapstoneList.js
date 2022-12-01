import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "./AssessmentProvider"
import "./Assessments.css"

export const CapstoneList = () => {
    const { getCohortCapstones, cohortCapstones } = useContext(AssessmentContext)

    useEffect(() => {
        const cohort = localStorage.getItem("activeCohort")
        getCohortCapstones(cohort)
    }, [])

    return (
        <article className="container--assessmentForm">
            <section className="assessments">
                <h1>Capstone Season</h1>
                {
                    cohortCapstones.map(capstone => {
                        return <div key={`capstone--${capstone.id}`} className="capstone">
                            <header className="capstone__header">
                                {capstone.name} ({capstone.course})
                                {
                                    capstone.statuses.map(status => {
                                        return <div>{status.status} on {new Date(status.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}</div>
                                    })
                                }
                            </header>
                        </div>
                    })
                }
            </section>
        </article>
    )
}
