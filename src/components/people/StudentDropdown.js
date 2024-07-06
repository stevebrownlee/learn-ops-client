import React, { useContext, useEffect, useRef, useState } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
    DotFilledIcon,
    CheckIcon,
    ChevronRightIcon,
    DropdownMenuIcon,
    CaretDownIcon,
    DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { PeopleContext } from "./PeopleProvider.js"
import { CourseContext } from "../course/CourseProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"

export const StudentDropdown = ({
    toggleStatuses, student,
    getStudentNotes, toggleNote,
    toggleTags, assignStudentToProject
}) => {
    const { statuses } = useContext(AssessmentContext)
    const {
        activeStudent, getCohortStudents,
        updateStudentCurrentAssessment,
        setStudentCurrentAssessment, activateStudent
    } = useContext(PeopleContext)
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const { activeCohort } = useContext(CohortContext)

    const [bookmarksChecked, setBookmarksChecked] = useState(true)
    const [urlsChecked, setUrlsChecked] = useState(false)
    const [person, setPerson] = useState('')

    return (
        <DropdownMenu.Root onOpenChange={(open) => {
            if (open) {
                activateStudent(student)
            }
        }}>
            <DropdownMenu.Trigger asChild >
                <button className="IconButton" aria-label="Student options">
                    <CaretDownIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => toggleNote()}>
                        Learner Notes
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => toggleTags()}>
                        Tag Learner
                    </DropdownMenu.Item>


                    {
                        activeStudent?.assessment_status_id > 2
                            ? <>
                                <DropdownMenu.Separator className="DropdownMenuSeparator" />
                                <DropdownMenu.Label className="DropdownMenuLabel">Book Assessment</DropdownMenu.Label>
                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                                        Assessment status
                                        <div className="RightSlot">
                                            <ChevronRightIcon />
                                        </div>
                                    </DropdownMenu.SubTrigger>
                                    <DropdownMenu.SubContent
                                        className="DropdownMenuSubContent"
                                        sideOffset={2}
                                        alignOffset={-5}
                                    >
                                        {
                                            statuses.map(status => {
                                                if (activeStudent?.assessment_status_id > 0 && status.id > 2) {
                                                    return <DropdownMenu.Item key={`status--${status.id}`} className="DropdownMenuItem"
                                                        onClick={() => {
                                                            let operation = null
                                                            if (activeStudent.assessment_status_id === 0) {
                                                                operation = setStudentCurrentAssessment(activeStudent)
                                                            } else {
                                                                if (status.status === "Reviewed and Complete") {
                                                                    const certification = window.confirm(`You certify that the student has been evaluated and has understanding and competency in the objectives for this book.`)
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
                                                        }}>{status.status}</DropdownMenu.Item>
                                                }
                                            })
                                        }
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Sub>
                            </>
                            : ""
                    }


                    <DropdownMenu.Separator className="DropdownMenuSeparator" />
                    <DropdownMenu.Label className="DropdownMenuLabel">Progress Tracking</DropdownMenu.Label>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                            Assign to project
                            <div className="RightSlot">
                                <ChevronRightIcon />
                            </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent
                                className="DropdownMenuSubContent"
                                sideOffset={2}
                                alignOffset={-5}
                            >
                                {
                                    activeCourse.books.map(book => {
                                        if (book.index >= student.book_index) {
                                            return <DropdownMenu.Sub key={`subbook--${book.id}`}>
                                                <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                                                    {book.name}
                                                    <div className="RightSlot"> <ChevronRightIcon /> </div>
                                                </DropdownMenu.SubTrigger>
                                                <DropdownMenu.SubContent
                                                    className="DropdownMenuSubContent"
                                                    sideOffset={2}
                                                    alignOffset={-5}
                                                >
                                                    {
                                                        book.projects.map(project => {
                                                            if (project.index === 99) {
                                                                return null
                                                            }
                                                            return <DropdownMenu.Item key={`subproject--${project.id}`}
                                                                onClick={() => assignStudentToProject(student, project)}
                                                                className="DropdownMenuItem">
                                                                {project.name}
                                                            </DropdownMenu.Item>
                                                        })
                                                    }
                                                </DropdownMenu.SubContent>
                                            </DropdownMenu.Sub>
                                        }
                                    })
                                }
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
