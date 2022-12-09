import React, { useContext } from "react"
import { AssessmentIcon } from "../../svgs/AssessmentIcon.js"
import { EditIcon } from "../../svgs/EditIcon.js"
import { GlobeIcon } from "../../svgs/GlobeIcon.js"
import { NoteIcon } from "../../svgs/NoteIcon.js"
import { ProposalIcon } from "../../svgs/ProposalIcon.js"
import { TagIcon } from "../../svgs/TagIcon.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import "./Student.css"
import { StudentTabList } from "./StudentTabList.js"

export const Student = ({
    student, toggleProjects,
    toggleStatuses, toggleTags,
    toggleNote, toggleCohorts
}) => {
    const {
        activateStudent, setStudentCurrentAssessment,
        getCohortStudents, untagStudent, activeStudent,
        getStudentNotes, getStudentCoreSkills
    } = useContext(PeopleContext)
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

    const hideOverlay = (e) => {
        document.querySelector('.overlay').style.display = "none"
    }

    return (
        <>
            <div className={`personality--${student.archetype} student ${setAssessmentIndicatorBorder(student.assessment_status)}`}>
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
                        } tip={`${student.assessment_status === 0 ? "Assign book assessment to student" : "Update assessment status"}`} />
                    </div>
                    <div className="action action--notes">
                        <NoteIcon tip="Enter in your notes about this student" />
                    </div>
                </div>
                <div className="student__score--mini">
                    {student.score}
                </div>
                <div className="student__proposals">
                    {
                        student.proposals.map(p => {
                            if (p.status === "submitted") {
                                return <ProposalIcon key="pendingProposal" color="red" />
                            }
                            else if (p.status === "reviewed") {
                                return <ProposalIcon key="reviewingProposal" color="goldenrod" />
                            }
                            else if (p.status === "approved") {
                                return <ProposalIcon key="completedProposal" color="dodgerblue" />
                            }
                        })
                    }
                </div>
                <div className="student__header">
                    <h4 className="student__name"
                        onClick={() => {
                            activateStudent(student)
                            getStudentCoreSkills(student.id)
                            document.querySelector('.overlay').style.display = "block"
                        }}
                    >{student.name}</h4>
                    <div className="student__book">
                        {student.book.name} <EditIcon helpFunction={() => {
                            activateStudent(student)
                            toggleProjects()
                        }} />
                    </div>
                    <div className="student__project">
                        {student.book.project}
                    </div>
                </div>
                <div className="student__footer">
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
                <div className="student__tags">
                    {
                        student.tags.map(tag => <span key={`tag--${tag.id}`}
                            onClick={() => {
                                untagStudent(tag.id).then(() => {
                                    getCohortStudents(activeCohort.id)
                                })
                            }}
                            className="student--tag">
                            {tag.tag.name}
                            <span className="delete clickable"
                                onClick={e => {
                                    e.stopPropagation()
                                    untagStudent(tag.id).then(() => {
                                        getCohortStudents(activeCohort.id)
                                    })
                                }}
                            >&times;</span>
                        </span>
                        )
                    }
                </div>
            </div>

            <div className="overlay" onClick={hideOverlay}>
            {/* <div className="overlay"> */}
                <div className="card">
                    <div className="card-body">
                        <header className="student__header">
                            <h2 className="card-title student__info">
                                {activeStudent.name}
                            </h2>
                            <div className="student__score">
                                {activeStudent.score}
                            </div>
                        </header>
                        <div className="card-text">
                            <div className="student__details">

                                <div className="student__github">
                                    Github: <a href={`https://www.github.com/${activeStudent.github}`}>
                                        {`https://www.github.com/${activeStudent.github}`}</a>
                                </div>
                                <div className="student__cohort">
                                    Cohort: <button className="fakeLink"
                                        onClick={() => {
                                            toggleCohorts()
                                        }}>
                                        {activeStudent?.cohorts?.map(c => c.name).join(", ")}
                                    </button>
                                </div>
                            </div>

                            <CoreSkillSliders hideOverlay={hideOverlay} />
                            <StudentTabList hideOverlay={hideOverlay} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
