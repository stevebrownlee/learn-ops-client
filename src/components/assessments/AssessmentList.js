import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { AssessmentContext } from "./AssessmentProvider"
import "./Assessments.css"

export const AssessmentList = () => {
    const {
        getAssessmentList, deleteSelfAssessment,
        allAssessments
    } = useContext(AssessmentContext)

    const history = useHistory()

    useEffect(() => {
        getAssessmentList()
    }, [])

    return <article className="container--assessmentList">
        <header className="assessment__header">
            <button className="button button--isi button--border-thick button--round-l button--size-s"
                onClick={() => history.push("/assessments/new")}>
                <i className="button__icon icon icon-book"></i>
                <span>Create Assessment</span>
            </button>
        </header>

        <section className="assessments">
            {
                allAssessments.map(assessment => {
                    return <div key={`assessment--${assessment.id}`} className="assessment">
                        <header className="assessment__header">
                            <a href={assessment.source_url} target="_blank">{assessment.name}</a>
                        </header>

                        <h3>Objectives</h3>
                        <section className="assessment__objectives_list">
                            {
                                assessment.objectives.map(objective => <div
                                    key={`obj--${objective.id}`}
                                    className="objective__badge">{objective.label}
                                </div>)
                            }
                        </section>

                        <footer className="assessment__footer">
                            <EditIcon clickFunction={() => history.push(`/assessments/edit/${assessment.id}`)} />
                            <DeleteIcon clickFunction={() => deleteSelfAssessment(assessment.id).then(getAssessmentList)} />

                            <div className="assessment__book">{assessment.assigned_book.name} - {assessment.course.name}</div>
                        </footer>
                    </div>
                })
            }
        </section>
    </article>
}
