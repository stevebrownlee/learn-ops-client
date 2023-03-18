import React, { useContext, useState } from "react"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"

export const StudentProposals = () => {
    const { activeCohort } = useContext(CohortContext)
    const {
        activeStudent, proposals, getCohortStudents,
        getStudentProposals
    } = useContext(PeopleContext)
    const {
        revokeApproval, proposalStatuses,
        addToProposalTimeline
    } = useContext(AssessmentContext)

    const capstoneStatuses = (proposalId, currentStatuses) => {
        return proposalStatuses.map(s => {
            const statusExists = currentStatuses.find(cs => cs.status === s.status)
            if (!statusExists) {
                return <button key={`asst--${s.id}`} className="fakeLink button--capstoneStage"
                    onClick={(e) => {
                        addToProposalTimeline(proposalId, s.id)
                            .then(() => getStudentProposals(activeStudent?.id))
                            .then(() => getCohortStudents(activeCohort))
                    }}>{s.status}</button>
            }
        })
    }

    const revoke = (timelineStatus) => {
        revokeApproval(timelineStatus)
            .then(() => getStudentProposals(activeStudent?.id))
            .then(() => getCohortStudents(activeCohort))
    }

    return <section className="section--proposals">
        <div className="card-title">
            <h3>Capstone Proposals</h3>
        </div>
        <div className="proposals">
            {
                proposals.map(p => <div key={`prop--${p.id}`} className="proposal">
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

                    <div className="proposalStatuses">
                        {capstoneStatuses(p.id, p.statuses)}
                    </div>
                </div>
                )
            }
        </div>
    </section>
}
