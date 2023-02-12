import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { AssessmentContext } from "../assessments/AssessmentProvider"
import { CohortContext } from "../cohorts/CohortProvider"

export const AssessmentStatusDialog = ({ toggleStatuses }) => {
    const {
        activeStudent, getCohortStudents,
        updateStudentCurrentAssessment,
        setStudentCurrentAssessment
    } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)
    const { getStatuses, statuses, getBookAssessment } = useContext(AssessmentContext)

    const [assessment, setAssessment] = useState([])

    useEffect(() => {
        getStatuses()
    }, [])

    useEffect(() => {
        if (activeStudent.book) {
            getBookAssessment(activeStudent?.book?.id).then(data => setAssessment(data[0]))
        }
    }, [activeStudent])

    return <dialog id="dialog--statuses" className="dialog--statuses">
        <h2>{activeStudent?.name} is {activeStudent?.assessment_status === 0 ? "not assigned to the assessment" : `working on the self-assessment for ${activeStudent?.book?.name}`} </h2>
        <h4>Update Self-Assessment Status</h4>
        <section className="statusButtons">
            {
                statuses.map(status => {
                    if ((activeStudent.assessment_status > 0 && status.status !== "In Progress") ||
                        (activeStudent.assessment_status === 0 && status.status === "In Progress")) {
                        return <button className="statusButton" key={`st--${status.id}`}
                            onClick={() => {
                                let operation = null
                                if (activeStudent.assessment_status === 0) {
                                    operation = setStudentCurrentAssessment(activeStudent)
                                } else {
                                    if (status.status === "Reviewed and Complete") {
                                        const certification = window.confirm(`You certify that the student has been evaluated and has understanding and competency in the following objectives\n\n${assessment.objectives.map(o => o.label).join("\n")}
                                        `)
                                        if (certification) {
                                            operation = updateStudentCurrentAssessment(activeStudent, status.id)
                                        }
                                    }
                                    else {
                                        operation = updateStudentCurrentAssessment(activeStudent, status.id)
                                    }
                                }
                                if (operation) {
                                    operation.then(() => {
                                        toggleStatuses()
                                        getCohortStudents(activeCohort)
                                    })
                                }
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
