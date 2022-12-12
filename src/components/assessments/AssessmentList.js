import React, { useContext, useEffect } from "react"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { AssessmentContext } from "./AssessmentProvider"
import "./Assessments.css"

export const AssessmentList = () => {
    const {
        getAssessmentList, deleteSelfAssessment,
        allAssessments
    } = useContext(AssessmentContext)

    useEffect(() => {
        getAssessmentList()
    }, [])

    return <article className="container--assessmentList">
        <section className="assessments">
            {
                allAssessments.map(assessment => {
                    return <div key={`assessment--${assessment.id}`} className="assessment">
                        <header className="assessment__header">
                            <a href={assessment.source_url} target="_blank">{assessment.name}</a>
                        </header>
                        <section className="assessment__name">
                            <div>{assessment.assigned_book.name} - {assessment.course.name}</div>
                        </section>
                        <footer className="assessment__footer">
                            <DeleteIcon clickFunction={() => deleteSelfAssessment(assessment.id).then(getAssessmentList)} />
                        </footer>
                    </div>
                })
            }
        </section>
    </article>
}
