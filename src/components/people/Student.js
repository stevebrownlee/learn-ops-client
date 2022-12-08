import React, { useContext } from "react"
import { AssessmentIcon } from "../../svgs/AssessmentIcon.js"
import { EditIcon } from "../../svgs/EditIcon.js"
import { GlobeIcon } from "../../svgs/GlobeIcon.js"
import { NoteIcon } from "../../svgs/NoteIcon.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student, toggleProjects, toggleStatuses }) => {
    const { activateStudent, setStudentCurrentAssessment, getCohortStudents } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    const setAssessmentIndicatorBorder = (status) => {
        switch (status) {
            case 0:
                return ""
                break;
            case 1:
                return "student--takingAssessment"
                break;
            case 2:
                return "student--assessmentReviewNeeded"
                break;
            case 3:
                return "student--assessReviewComplete"
                break;
        }
    }

    return (
        <>
            <div className={`personality--${student.personality} student ${setAssessmentIndicatorBorder(student.assessment_status)}`}>
                <div className="student__actions">
                    <div className="action action--assessments">
                        <AssessmentIcon clickFunction={
                            () => {
                                activateStudent(student)
                                if (student.assessment_status === 0) {
                                    setStudentCurrentAssessment(student)
                                        .then(() => getCohortStudents(activeCohort.id))
                                }
                                else {
                                    toggleStatuses()
                                }
                            }
                        } tip="View and assign self-assessments to student" />
                    </div>
                    <div className="action action--notes">
                        <NoteIcon tip="Enter in your notes about this student" />
                    </div>
                </div>
                <div className="student__header">
                    <h4 className="student__name">{student.name}</h4>
                    <div className="student__book">
                        {student.book.name} <EditIcon helpFunction={() => {
                            toggleProjects(student)
                            activateStudent(student)
                        }} />
                    </div>
                    <div className="student__project">
                        {student.book.project}
                    </div>
                </div>
                <div className="student__footer">
                    <div>
                        {student.score}
                    </div>
                    <div>
                        {
                            student.proposals.map(p => {
                                if (p.status === "submitted") {
                                    return "📕"
                                }
                                else if (p.status === "reviewed") {
                                    return "📒"
                                }
                                else if (p.status === "approved") {
                                    return "📗"
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
