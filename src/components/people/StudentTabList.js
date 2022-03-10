import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Record } from "../records/Record.js"
import "./Student.css"

export const StudentTabList = ({ student }) => {
    const {
        getStudentAssessments, getAssessmentList,
        studentAssessments, allAssessments, saveStudentAssessment,
        getStatuses, statuses, changeStatus
    } = useContext(AssessmentContext)
    const history = useHistory()

    useEffect(() => {
        getStudentAssessments(student.id)
        getAssessmentList()
        getStatuses()
    }, [student])

    const createStatus = (status) => {
        let className = ""

        switch (status) {
            case "In Progress":
                className = "assessment--inProgress"
                break
            case "Ready for Review":
                className = "assessment--readyForReview"
                break
            case "Reviewed and Complete":
                className = "assessment--reviewedSuccess"
                break
            case "Reviewed and Incomplete":
                className = "assessment--reviewedFail"
                break
        }

        return (<div className={`assessment__status ${className}`}>
            {status}
        </div>)
    }

    const assign = (ass) => {
        saveStudentAssessment(ass.id, student.id)
            .then(() => getStudentAssessments(student.id))
    }

    const updateAssessmentStatus = (assessmentId, statusId) => {
        changeStatus(assessmentId, statusId)
            .then(() => getStudentAssessments(student.id))
    }

    return (
        <ul className="tabs" role="tablist">
            <li>
                <input type="radio" name="tabs" id="tab1" defaultChecked />
                <label htmlFor="tab1" role="tab" aria-selected="true" aria-controls="panel1" tabIndex="0">Objectives</label>
                <article id="tab-content1" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                        <i className="button__icon icon icon-plus button__icon--only position--topright"
                            onClick={() => {
                                history.push(`/records/new/${student.id}`)
                            }}></i>

                    <section className="records--overview">
                        {
                            student.records?.map(record => {
                                return <Record key={`record--${record.id}`} record={record} />
                            })
                        }
                    </section>
                </article>
            </li>

            <li>
                <input type="radio" name="tabs" id="tab2" />
                <label htmlFor="tab2" role="tab" aria-selected="false" aria-controls="panel2" tabIndex="0">Assessments</label>
                <article id="tab-content2" className="tab-content" role="tabpanel" aria-labelledby="specification" aria-hidden="true">
                    <section className="records--overview">
                        <div className="rightAlign">

                            <div className="dropdown">
                                <div className="dropdown__text">
                                    <button className="button button--isi button--border-thick button--round-l button--size-s button--assessment">
                                        <i className="button__icon icon icon-book"></i>
                                        <span>Send Assessment</span>
                                    </button>
                                </div>
                                <div className="dropdown__content assessment--dropdown">
                                    {
                                        allAssessments.map(ass => {
                                            return <a key={`assessment--${ass.id}`}
                                                onClick={() => assign(ass)} href="#"
                                                className="dropdownItem--condensed">
                                                {ass.name}
                                            </a>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            studentAssessments.map(assessment => {
                                return <React.Fragment key={`assessment--${assessment.id}`}>
                                    <div className="assessment__name">
                                        {assessment.assessment.name}
                                    </div>

                                    <div className="assessment">

                                        {createStatus(assessment.status)}

                                        <div className="assessment__statusDropdown">
                                            <select id="statuses"
                                                onChange={(e) => updateAssessmentStatus(assessment.id, e.target.value)}>
                                                <option value="0">Change status</option>
                                                {
                                                    statuses.map(s => {
                                                        return <option key={`asst--${s.id}`} value={s.id}>{s.status}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </React.Fragment>
                            })
                        }
                    </section>
                </article>
            </li>
        </ul>
    )
}
