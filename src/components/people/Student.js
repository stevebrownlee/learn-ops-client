import React, { useContext, useRef, useState } from "react"
import { AssessmentIcon } from "../../svgs/AssessmentIcon"
import { EditIcon } from "../../svgs/EditIcon"
import { NoteIcon } from "../../svgs/NoteIcon"
import { ProposalIcon } from "../../svgs/ProposalIcon"
import { TagIcon } from "../../svgs/TagIcon"
import { AssessmentContext } from "../assessments/AssessmentProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import { StandupContext } from "../dashboard/Dashboard"
import "./Student.css"

export const Student = ({
    student, toggleProjects,
    toggleStatuses, toggleTags,
    toggleNote, toggleCohorts
}) => {
    const {
        activateStudent, setStudentCurrentAssessment,
        getCohortStudents, untagStudent,
        getStudentNotes, getStudentCoreSkills, getStudentProposals,
        getStudentLearningRecords, getStudentPersonality
    } = useContext(PeopleContext)
    const showAllProjects = useContext(StandupContext)
    const { activeCohort } = useContext(CohortContext)
    const { getProposalStatuses } = useContext(AssessmentContext)

    const [delayHandler, setDelayHandler] = useState(null)

    const studentFooter = useRef()

    const handleMouseEnter = event => {
        setDelayHandler(setTimeout(() => {
            studentFooter.current.classList.add("grow")
        }, 250))
    }

    const handleMouseLeave = () => {
        studentFooter.current.classList.remove("grow")
        clearTimeout(delayHandler)
    }

    const setAssessmentIndicatorBorder = (status) => {
        switch (status) {
            case 0:
                return ""
            case 1:
                return "student--takingAssessment"
            case 2:
                return "student--assessmentReviewNeeded"
            case 3:
                return "student--assessReviewIncomplete"
            case 4:
                return "student--assessReviewComplete"
        }
    }

    return <>
        <div id={`student--${student.id}`}
            className={`
                personality--${student.archetype}
                student
                ${showAllProjects ? "student--mini" : "student--regular"}
                ${setAssessmentIndicatorBorder(student.assessment_status)}
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable={showAllProjects}
            onDragStart={e => {
                const currentProjectId = e.nativeEvent.target.parentElement.id.split("--")[1]
                const transferStudent = { ...student, currentProject: parseInt(currentProjectId) }
                e.dataTransfer.setData("text/plain", JSON.stringify(transferStudent))
            }}
        >

            <div className="student__proposals">
                {
                    student.proposals.map(p => {
                        if (p.status === "submitted") {
                            return <ProposalIcon key={`pendingProposal--${p.id}`} color="red" />
                        }
                        else if (p.status === "reviewed") {
                            return <ProposalIcon key={`reviewingProposal--${p.id}`} color="goldenrod" />
                        }
                        else if (p.status === "approved") {
                            return <ProposalIcon key={`completedProposal--${p.id}`} color="dodgerblue" />
                        }
                        else if (p.status === "mvp") {
                            return <ProposalIcon key={`completedProposal--${p.id}`} color="green" />
                        }
                    })
                }
            </div>
            <div className="student__header">
                <div className="student__score--mini">
                    {student.score}
                </div>
                <h4 className="student__name"
                    onClick={() => {
                        activateStudent(student)
                        getStudentCoreSkills(student.id)
                        getStudentProposals(student.id)
                        getStudentLearningRecords(student.id)
                        getProposalStatuses()
                        getStudentPersonality(student.id)
                        document.querySelector('.overlay--student').style.display = "block"
                    }}
                >{student.name}</h4>
            </div>

            {
                student.tags.length > 0
                    ? <div className="student__tags">
                        {
                            student.tags.map(tag => <span key={`tag--${tag.id}`}
                                onClick={() => {
                                    untagStudent(tag.id).then(() => {
                                        getCohortStudents(activeCohort)
                                    })
                                }}
                                className="student--tag">
                                {tag.tag.name}
                                <span className="delete clickable"
                                    onClick={e => {
                                        e.stopPropagation()
                                        untagStudent(tag.id).then(() => {
                                            getCohortStudents(activeCohort)
                                        })
                                    }}
                                >&times;</span>
                            </span>
                            )
                        }
                    </div>
                    : ""
            }

            <div ref={studentFooter} className="student__footer">
                <div className="action action--assessments">
                    <EditIcon tip={"Change current project"} clickFunction={() => {
                        activateStudent(student)
                        toggleProjects()
                    }} />
                </div>
                <div className="action action--assessments">
                    <AssessmentIcon clickFunction={
                        () => {
                            activateStudent(student)
                            toggleStatuses()
                        }
                    } tip={`${student.assessment_status === 0 ? "Assign book assessment to student" : "Update assessment status"}`} />
                </div>
                <div className="action action--notes">
                    <NoteIcon clickFunction={() => {
                        activateStudent(student)
                        getStudentNotes(student.id)
                        toggleNote()
                    }}
                        tip="Enter in your notes about this student" />
                </div>
                <div className="student__tag--add">
                    <TagIcon clickFunction={() => {
                        activateStudent(student)
                        toggleTags()
                    }} tip="Add a tag to this student" />
                </div>
            </div>

        </div>
    </>
}
