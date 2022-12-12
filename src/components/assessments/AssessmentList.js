import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "./AssessmentProvider"
import "./Assessments.css"

export const AssessmentList = () => {
    const { getAssessmentList, allAssessments } = useContext(AssessmentContext)

    useEffect(() => {
        getAssessmentList()
    }, [])

    return (
        <article className="container--assessmentForm">
            <section className="assessments">
                <h1>Current Assessments</h1>
                {
                    allAssessments.map(assessment => {
                        return <div key={`assessment--${assessment.id}`} className="assessment--listitem">
                            <header className="assessment__header">
                                <a href={assessment.source_url} target="_blank">{assessment.name}</a>
                            </header>
                            <section>
                                <div>{assessment.assigned_book.name} - {assessment.course.name}</div>
                            </section>
                        </div>
                    })
                }
            </section>
        </article>
    )
}
