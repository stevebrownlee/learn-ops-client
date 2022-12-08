import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { AssessmentContext } from "../assessments/AssessmentProvider"
import Settings from "../Settings"
import { CohortContext } from "../cohorts/CohortProvider"

export const AssessmentStatusDialog = ({ toggleStatuses }) => {
    const { activeStudent, getCohortStudents, updateStudentCurrentAssessment } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)
    const { getStatuses, statuses, changeStatus } = useContext(AssessmentContext)

    useEffect(() => {
        getStatuses()
    }, [])

    return <dialog id="dialog--statuses" className="dialog--statuses">
        <section className="statutsButtons">
            {
                statuses.map(status => {
                    if (status.status !== "In Progress") {
                        return <button key={`st--${status.id}`}
                            onClick={() => {
                                updateStudentCurrentAssessment(activeStudent, status.id)
                                    .then(() => {
                                        toggleStatuses()
                                        getCohortStudents(activeCohort.id)
                                    })
                            }}>{status.status}</button>
                    }
                })
            }
        </section>

        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={() => {
                toggleStatuses()
            }}>[ close ]</button>
    </dialog>
}
