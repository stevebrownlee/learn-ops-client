import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import { HumanDate } from "../utils/HumanDate.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import "./Status.css"
import { fetchIt } from "../utils/Fetch.js"

export const StudentTabList = () => {
    const [chosenAssessment, chooseAssessment] = useState(0)
    const {
        activeStudent, getStudentProposals,
        proposals, getCohortStudents
    } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)
    const {
        getStudentAssessments, getAssessmentList, revokeApproval,
        studentAssessments, allAssessments, saveStudentAssessment,
        getStatuses, statuses, changeStatus, proposalStatuses,
        getProposalStatuses, addToProposalTimeline
    } = useContext(AssessmentContext)
    const history = useHistory()

    useEffect(() => {
        getProposalStatuses()
        getStatuses()
        getAssessmentList()
    }, [])

    useEffect(() => {
        getStudentAssessments(activeStudent.id)
        getStudentProposals()
    }, [activeStudent])

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

    const assign = () => {
        if (chosenAssessment > 0) {
            saveStudentAssessment(chosenAssessment, activeStudent.id)
                .then(() => {
                    getStudentAssessments(activeStudent.id)
                    chooseAssessment(0)
                })
        }
    }

    const updateAssessmentStatus = (assessmentId, statusId) => {
        changeStatus(assessmentId, statusId)
            .then(() => getStudentAssessments(activeStudent.id))
    }

    const capstoneStatuses = (proposalId, currentStatuses) => {
        return proposalStatuses.map(s => {
            const statusExists = currentStatuses.find(cs => cs.status === s.status)
            if (!statusExists) {
                return <button className="fakeLink button--capstoneStage" key={`asst--${s.id}`}
                    onClick={(e) => {
                        addToProposalTimeline(proposalId, s.id)
                            .then(getStudentProposals)
                            .then(() => {
                                if ("id" in activeCohort) {
                                    getCohortStudents(activeCohort.id)
                                }
                            })
                    }}>{s.status}</button>
            }
        })
    }

    const revoke = (timelineStatus) => {
        revokeApproval(timelineStatus)
            .then(getStudentProposals)
            .then(() => getCohortStudents(activeCohort.id))
    }

    return (
        <ul className="tabs" role="tablist">
            <li>
                <input type="radio" name="tabs" id="tab1" defaultChecked />
                <label htmlFor="tab1" role="tab" aria-selected="true" aria-controls="panel1" tabIndex="0">Objectives</label>
                <article id="tab-content1" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <button className="button button--isi button--border-thick button--round-l button--size-s button--assessment"
                        onClick={() => {
                            history.push(`/records/new/${activeStudent.id}`)
                        }}>
                        <i className="button__icon icon icon-book"></i>
                        <span>Start Objective</span>
                    </button>

                    <section className="records--overview">
                        {
                            activeStudent.records?.map(record => {
                                return <Record key={`record--${record.id}`} record={record} />
                            })
                        }
                    </section>
                </article>
            </li>

            <li>
                <input type="radio" name="tabs" id="tab2" />
                <label htmlFor="tab2" role="tab" aria-selected="true" aria-controls="panel2" tabIndex="0">Status</label>
                <article id="tab-content2" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <h2>Daily Status</h2>

                    {
                        activeStudent.statuses.map(status => <React.Fragment key={`status--${status.id}`}>
                            <div className="status">
                                <div className="status__note"> {status.status} </div>
                                <div className="status__date">
                                    Recorded on <HumanDate date={status.created_on.split("T")[0]} /> by {status.author}
                                </div>
                            </div>
                            <div className="status__separator"></div>
                        </React.Fragment>)
                    }

                </article>
            </li>

            <li>
                <input type="radio" name="tabs" id="tab3" />
                <label htmlFor="tab3" role="tab" aria-selected="false" aria-controls="panel3" tabIndex="0">Assessments</label>
                <article id="tab-content3" className="tab-content" role="tabpanel" aria-labelledby="specification" aria-hidden="true">
                    <section className="records--overview">
                        <div className="rightAlign">
                            <select className="form-control"
                                value={chosenAssessment}
                                onChange={(e) => chooseAssessment(parseInt(e.target.value))}>
                                <option value="0">Choose assessment...</option>
                                {
                                    allAssessments.map(asst => {
                                        return <option key={`asst--${asst.id}`} value={asst.id}>{asst.name}</option>
                                    })
                                }
                            </select>

                            <button onClick={assign}
                                className="button button--isi button--border-thick button--round-l button--size-s button--assessment">
                                <i className="button__icon icon icon-book"></i>
                                <span>Assign</span>
                            </button>

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

            <li>
                <input type="radio" name="tabs" id="tab4" />
                <label htmlFor="tab4" role="tab" aria-selected="true" aria-controls="panel4" tabIndex="0">Proposals</label>
                <article id="tab-content4" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <h2>Capstone Proposals</h2>
                    {
                        proposals.map(p => <div key={`prop--${p.id}`} className="table">
                            <div className="cell">
                                <a href={p.proposal_url} target="_blank">{p.course}</a>
                                {
                                    p.statuses.map(s => <div key={`propstat--${s.id}`} className="proposalStatus">
                                        <span>{s.status} on {s.date}</span>
                                        {
                                            s.status === "Approved"
                                                ? <button className="fakeLink small button--revoke"
                                                    onClick={() => revoke(s)}
                                                    >[ revoke ]</button>
                                                : <span className="button--revoke"> </span>
                                        }

                                    </div>)
                                }
                            </div>
                            <div className="cell">
                                <div>Change status to...</div>
                                {capstoneStatuses(p.id, p.statuses)}
                            </div>
                        </div>
                        )
                    }
                </article>
            </li>

            <li>
                <input type="radio" name="tabs" id="tab5" />
                <label htmlFor="tab5" role="tab" aria-selected="true" aria-controls="panel5" tabIndex="0">Persona</label>
                <article id="tab-content5" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <div className="persona">
                        <section className={`persona__myers-briggs section--persona personality--${activeStudent?.personality?.briggs_myers_type?.description?.type}`}>
                            <h2>{activeStudent?.personality?.briggs_myers_type.code}</h2>
                            <h3>Summary</h3>
                            <p>{activeStudent?.personality?.briggs_myers_type?.description?.summary}</p>
                            <h3>Emotions &amp; Communication</h3>
                            <p>{activeStudent?.personality?.briggs_myers_type?.description?.details}</p>
                        </section>

                        <section className="persona__bfi section--persona">
                            <h2>BFI</h2>
                            <div>Extraversion: {activeStudent?.personality?.bfi_extraversion}</div>
                            <div>Conscientiousness: {activeStudent?.personality?.bfi_conscientiousness}</div>
                            <div>Neuroticism: {activeStudent?.personality?.bfi_neuroticism}</div>
                            <div>Openness to Experience: {activeStudent?.personality?.bfi_openness}</div>
                            <div>Agreeableness: {activeStudent?.personality?.bfi_agreeableness}</div>
                        </section>
                    </div>

                </article>
            </li>
        </ul>
    )
}
