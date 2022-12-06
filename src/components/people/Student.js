import React, { useContext } from "react"
import { AssessmentIcon } from "../../svgs/AssessmentIcon.js"
import { GlobeIcon } from "../../svgs/GlobeIcon.js"
import { NoteIcon } from "../../svgs/NoteIcon.js"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student }) => {
    const { getStudent } = useContext(PeopleContext)

    return (
        <>
            <div className={`personality--${student.personality} student`}
                onClick={() => getStudent(student.id)}>
                <div className="student__actions">
                    <span className="action action--notes">
                        <NoteIcon tip="Enter in your notes about this student" />
                    </span>
                    <span className="action action--progress">
                        <GlobeIcon />
                    </span>
                    <span className="action action--assessments">
                        <AssessmentIcon />
                    </span>
                </div>
                <div className="student__header">
                    <h4>{student.name.split("").slice(0,15).join("")}</h4>
                </div>
                <div className="student__coreskills">
                    <div>Al: 5</div>
                    <div>An: 4</div>
                    <div>Co: 7</div>
                    <div>Le: 3</div>
                </div>
                <div className="student__footer">
                    <div>
                        {student.score}
                    </div>
                    <div>
                        {student.book.name}
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
