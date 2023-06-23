import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useModal from "../ui/useModal"

import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "./CohortProvider"

import { StudentDetails } from "../people/StudentDetails"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { Student } from "../people/Student"
import { StandupContext } from "../dashboard/Dashboard"
import { Toast, configureToasts } from "toaster-js"
import { Loading } from "../Loading.js"

import "./CapstoneList.css"
import "./Tooltip.css"

export const StudentCapstoneList = () => {
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const { capstoneSeason, setCapstoneSeason } = useContext(StandupContext)
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { cohortStudents, getCohortStudents, setCohortStudents } = useContext(PeopleContext)
    const [groupedProposals, setGroupedProposals] = useState(new Map())

    const history = useHistory()

    const getComponentData = (cohortId) => {
        return getActiveCourse(cohortId)
            .then(course => {
                localStorage.setItem("activeCourse", course.id)
                getCohortStudents(cohortId).then(
                    () => {
                        const students = structuredClone(cohortStudents)

                        const grouping = new Map()
                        grouping.set(0, []) // Submitted but no action yet
                        grouping.set(1, []) // Instructor marked as in review
                        grouping.set(2, []) // Proposal requires changes
                        grouping.set(3, []) // Proposal approved
                        grouping.set(4, []) // Unsubmitted
                        grouping.set(5, []) // Student reached MVP

                        const stagedStudents = students.map(student => {
                            const currentProposal = student.proposals.find(p => p?.course_name === activeCourse.name)

                            if (student.proposals.length === 0) {
                                grouping.get(4).push(student)
                                return student
                            }

                            switch (currentProposal.current_status) {
                                case "In Review":
                                    grouping.get(1).push(student)
                                    break;
                                case "Requires Changes":
                                    grouping.get(2).push(student)
                                    break;
                                case "Approved":
                                    grouping.get(3).push(student)
                                    break;
                                case "MVP":
                                    grouping.get(5).push(student)
                                    break;
                                default:
                                    grouping.get(0).push(student)
                                    break;
                            }
                            return student

                        })

                        setGroupedProposals(grouping)
                    }
                )
            })
    }

    useEffect(() => {
        if (activeCohort > 0) {
            getComponentData(activeCohort)
        }
    }, [activeCohort])

    useEffect(() => {
        const cohort = JSON.parse(localStorage.getItem("activeCohort"))
        if (cohort) {
            const cohortId = parseInt(cohort)
            if (!activeCohort) {
                activateCohort(cohortId)
            }
        }
        else {
            history.push("/cohorts")
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
        }
    }, [])

    const displayStatus = (student) => {
        const proposal = student.proposals.find(p => p?.course_name === activeCourse.name)
        if (proposal) {
            return proposal.current_status ?? "Submitted"
        }
        else {
            return "Not submitted"
        }
    }

    const mapConverter = ([groupNumber, arrayOfStudents]) => arrayOfStudents

    const stageGrouping = (studentArray) => {
        return <div className="group">
            {
                studentArray.map(student => {

                    return <div key={`student--${student.id}`} className="student__row">
                        <div>{student.name}</div>
                        <div>{displayStatus(student)}</div>
                        <div>
                            <select>
                                <option>Proposal In Review</option>
                                <option>Proposal Incomplete</option>
                                <option>Proposal Approved</option>
                                <option>MVP Reached</option>
                            </select>
                        </div>
                        <div>
                            {
                                student.proposals.map(proposal => {
                                    return <a className="proposal__link" href={proposal?.proposal_url}>{proposal.course_name} Proposal</a>
                                })
                            }
                        </div>
                    </div>
                })
            }

        </div>
    }


    return <section className="students--capstone"> {

        groupedProposals.size === 0
            ? <Loading />
            : Array.from(groupedProposals, mapConverter).map(stageGrouping)
    }

    </section>
}
