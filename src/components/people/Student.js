import React, { useContext, useRef, useState } from "react"

import { Flex, Text, Button, Card, Avatar, Box } from '@radix-ui/themes';

import { AssessmentContext } from "../assessments/AssessmentProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import { StandupContext } from "../dashboard/Dashboard"
import { StudentDropdown } from "./StudentDropdown.js"
import "./Student.css"
import { StudentNotePopup } from "./StudentNotePopup.js"

export const Student = ({
    student, toggleProjects,
    toggleStatuses, toggleTags,
    toggleNote, toggleCohorts,
    hasAssessment, assignStudentToProject
}) => {
    const {
        activateStudent, getCohortStudents, untagStudent,
        getStudentNotes, getStudentCoreSkills, getStudentProposals,
        getStudentLearningRecords
    } = useContext(PeopleContext)
    const { showAllProjects, toggleAllProjects, dragStudent, showTags, showAvatars } = useContext(StandupContext)
    const { activeCohort } = useContext(CohortContext)
    const { getProposalStatuses } = useContext(AssessmentContext)
    const [delayHandler, setDelayHandler] = useState(null)
    const studentFooter = useRef()

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
            default:
                return ""
        }
    }

    const displayTags = (student) => {
        if (!showTags) {
            return ""
        }
        return student.tags.length > 0
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

    const showStudentDetails = () => {
        activateStudent(student)
        getStudentCoreSkills(student.id)
        getStudentProposals(student.id)
        getStudentLearningRecords(student.id)
        getProposalStatuses()
        document.querySelector('.overlay--student').style.display = "block"
    }

    return <Card className={`
                personality--
                student
                ${showAvatars ? "student--regular" : "student-mini"}
                ${setAssessmentIndicatorBorder(student.assessment_status)}
            `}
        draggable={true}
        onDragStart={e => {
            const currentProjectId = e.nativeEvent.target.parentElement.id.split("--")[1]
            const transferStudent = Object.assign(Object.create(null), {
                id: student.id,
                bookId: student.book.id,
                bookIndex: student.book.index,
                projectId: parseInt(currentProjectId),
                assessment_status: student.assessment_status,
                hasAssessment
            })
            e.dataTransfer.setData("text/plain", JSON.stringify(transferStudent))

            setTimeout(() => {
                toggleAllProjects(true)
                dragStudent(transferStudent)
            }, 150)
        }}
    >
        <Flex gap="3" align="center">
            {
                showAvatars
                    ? <Avatar size="3" src={student.avatar} radius="full" fallback="T" />
                    : ""
            }

            <Box>
                <Text as="div" size="2" weight="bold">
                    <StudentDropdown toggleStatuses={toggleStatuses}
                        key={`dropdown--${student.id}`}
                        student={student}
                        toggleNote={toggleNote}
                        assignStudentToProject={assignStudentToProject}
                        toggleTags={toggleTags}
                        getStudentNotes={getStudentNotes} />

                    <div onClick={showStudentDetails} className="student__name">{student.name}</div>

                    <StudentNotePopup student={student} />
                </Text>
                <Text as="div" size="2" color="gray">
                    {displayTags(student)}
                </Text>
            </Box>
        </Flex>
    </Card>
}
