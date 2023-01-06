import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import { HumanDate } from "../utils/HumanDate.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { fetchIt } from "../utils/Fetch.js"
import "./Status.css"

export const StudentTabList = () => {
    const [chosenAssessment, chooseAssessment] = useState(0)
    const {
        activeCohort
    } = useContext(CohortContext)
    const {
        activeStudent, getStudentProposals, personality,
        proposals, getCohortStudents, learningRecords
    } = useContext(PeopleContext)
    const {
        getStudentAssessments, getAssessmentList, revokeApproval,
        studentAssessments, allAssessments, saveStudentAssessment,
        getStatuses, statuses, changeStatus, proposalStatuses,
        getProposalStatuses, addToProposalTimeline
    } = useContext(AssessmentContext)

    const history = useHistory()

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
                return <div key={`asst--${s.id}`}>
                    <button className="fakeLink button--capstoneStage"
                        onClick={(e) => {
                            addToProposalTimeline(proposalId, s.id)
                                .then(() => getStudentProposals(activeStudent.id))
                                .then(() => getCohortStudents(activeCohort))
                        }}>{s.status}</button>
                </div>
            }
        })
    }

    const revoke = (timelineStatus) => {
        revokeApproval(timelineStatus)
            .then(() => getStudentProposals(activeStudent.id))
            .then(() => getCohortStudents(activeCohort))
    }

    return (
        <ul className="tabs" role="tablist" onClick={e => e.stopPropagation()}>
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
                            learningRecords.map(record => {
                                return <Record key={`record--${record.id}`} record={record} />
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
                        <section className={`persona__myers-briggs section--persona personality--${personality?.briggs_myers_type?.description?.type}`}>
                            <h2>{personality?.briggs_myers_type?.code}</h2>
                            <h3>Summary</h3>
                            <p>{personality?.briggs_myers_type?.description?.summary}</p>
                            <h3>Emotions &amp; Communication</h3>
                            <p>{personality?.briggs_myers_type?.description?.details}</p>
                        </section>

                        <section className="persona__bfi section--persona">
                            <h2>BFI</h2>
                            <div>Extraversion: {personality?.bfi_extraversion}</div>
                            <div>Conscientiousness: {personality?.bfi_conscientiousness}</div>
                            <div>Neuroticism: {personality?.bfi_neuroticism}</div>
                            <div>Openness to Experience: {personality?.bfi_openness}</div>
                            <div>Agreeableness: {personality?.bfi_agreeableness}</div>
                        </section>
                    </div>

                </article>
            </li>
        </ul>
    )
}
