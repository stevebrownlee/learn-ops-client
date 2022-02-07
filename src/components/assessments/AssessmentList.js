import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "./AssessmentProvider"
import "./Assessments.css"

export const AssessmentList = () => {
    const { getAssessments, assessments } = useContext(AssessmentContext)

    useEffect(() => {
        getAssessments()
    }, [])

    return (
        <article className="container--assessmentForm">
            <section className="assessments">
                <h1>Current Assessments</h1>
                {
                    assessments.map(assessment => {
                        return <div key={`assessment--${assessment.id}`} className="assessment">
                            <header className="assessment__header">
                                <a href={assessment.source_url} target="_blank">{assessment.name} ({assessment.type})</a>
                            </header>
                        </div>
                    })
                }
            </section>
        </article>
    )
}
