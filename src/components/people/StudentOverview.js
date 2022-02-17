import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import "./Student.css"

export const StudentOverview = ({ currentStudent }) => {
    const { activeStudent } = useContext(PeopleContext)
    const {
        getStudentAssessments, getAssessmentList,
        studentAssessments, allAssessments, saveStudentAssessment,
        getStatuses, statuses, changeStatus
    } = useContext(AssessmentContext)
    const [student, setStudent] = useState({})
    const history = useHistory()

    useEffect(() => {
        if ("id" in activeStudent) {
            setStudent(activeStudent)
            getStudentAssessments(activeStudent.id)
            getAssessmentList()
            getStatuses()
        }
    }, [activeStudent])

    useEffect(() => {
        if (currentStudent) {
            setStudent(currentStudent)
        }
    }, [currentStudent])

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
        saveStudentAssessment(ass.id, activeStudent.id)
            .then(() => getStudentAssessments(activeStudent.id))
    }

    const updateAssessmentStatus = (assessmentId, statusId) => {
        changeStatus(assessmentId, statusId)
            .then(() => getStudentAssessments(activeStudent.id))
    }

    return (
        "id" in student
            ? <div className="card student">
                <div className="card-body">
                    <header className="student__header">
                        <h2 className="card-title student__info">{student.name} ({student.cohorts.map(c => c.name).join(", ")})</h2>
                        <div className="student__score">
                            {student.score}
                        </div>
                    </header>
                    <div className="card-text">
                        <div className="student__github">
                            Github: <a href={`https://www.github.com/${student.github}`}>
                                {`https://www.github.com/${student.github}`}</a>
                        </div>

                        <button className="button button--isi button--border-thick button--round-l button--size-s button--record"
                            onClick={() => {
                                history.push(`/records/new/${student.id}`)
                            }}
                        >
                            <i className="button__icon icon icon-book"></i>
                            <span>New Objective Record</span>
                        </button>

                        <button className="button button--isi button--border-thick button--round-l button--size-s button--record"
                            onClick={() => {
                                history.push({
                                    pathname: "/feedback/new",
                                    state: {
                                        studentId: student.id
                                    }
                                })
                            }}
                        >
                            <i className="button__icon icon icon-write"></i>
                            <span>Send Feedback</span>
                        </button>

                        <ul className="tabs" role="tablist">
                            <li>
                                <input type="radio" name="tabs" id="tab1" defaultChecked />
                                <label htmlFor="tab1" role="tab" aria-selected="true" aria-controls="panel1" tabIndex="0">Objectives</label>
                                <div id="tab-content1" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">
                                    <section className="records--overview">
                                        {
                                            student.records.map(record => {
                                                return <Record key={`record--${record.id}`} record={record} />
                                            })
                                        }
                                    </section>
                                </div>
                            </li>

                            <li>
                                <input type="radio" name="tabs" id="tab2" />
                                <label htmlFor="tab2" role="tab" aria-selected="false" aria-controls="panel2" tabIndex="0">Assessments</label>
                                <div id="tab-content2" className="tab-content" role="tabpanel" aria-labelledby="specification" aria-hidden="true">
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
                                                                href="#"
                                                                className="dropdownItem--condensed"
                                                                onClick={() => { assign(ass) }}>
                                                                {ass.name}
                                                            </a>
                                                        })
                                                    }
                                                </div>
                                            </div>

                                        </div>

                                        {
                                            studentAssessments.map(assessment => {
                                                return <div className="assessment" key={`assessment--${assessment.id}`}>
                                                    <div className="assessment__name">
                                                        {assessment.assessment.name}
                                                    </div>
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
                                            })
                                        }
                                    </section>
                                </div>
                            </li>
                        </ul>


                    </div>
                </div>
            </div>
            : <div></div>
    )
}
