import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useModal from "../ui/useModal"

import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "./CohortProvider"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"

import { StudentDetails } from "../people/StudentDetails"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { Student } from "../people/Student"
import { StandupContext } from "../dashboard/Dashboard"
import { Toast, configureToasts } from "toaster-js"
import { Loading } from "../Loading.js"

import "./CapstoneList.css"
import "./Tooltip.css"

export const StudentCapstoneList = ({ searchTerms }) => {
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const { capstoneSeason, setCapstoneSeason } = useContext(StandupContext)
    const { activeCohort, activateCohort } = useContext(CohortContext)
    const { cohortStudents, getCohortStudents, setCohortStudents } = useContext(PeopleContext)
    const [groupedProposals, setGroupedProposals] = useState(new Map())
    const { proposalStatuses, addToProposalTimeline, getProposalStatuses } = useContext(AssessmentContext)

    const history = useHistory()

    const getComponentData = (cohortId) => {
        return getActiveCourse(cohortId)
            .then(course => {
                localStorage.setItem("activeCourse", course.id)
                getCohortStudents(cohortId)
            })
    }

    useEffect(() => {
        if (activeCohort > 0) {
            getComponentData(activeCohort)
        }
    }, [activeCohort])

    useEffect(() => {
        if (cohortStudents.length > 0) {
            const grouping = new Map([
                [0, []], // Submitted but no action yet
                [1, []], // Instructor marked as in review
                [2, []], // Proposal requires changes
                [3, []], // Proposal approved
                [4, []], // Unsubmitted
                [5, []]  // Student reached MVP
            ])

            for (const student of cohortStudents) {
                const currentProposal = student.proposals.find(p => p?.course_name === activeCourse.name)

                if (student.proposals.length === 0 || !currentProposal) {
                    grouping.get(4).push(student)
                }
                else {
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
                }
            }

            setGroupedProposals(grouping)
        }
    }, [cohortStudents])

    useEffect(() => {
        const cohort = JSON.parse(localStorage.getItem("activeCohort"))
        if (cohort) {
            const cohortId = parseInt(cohort)
            if (!activeCohort) {
                activateCohort(cohortId)
            }
            getProposalStatuses()
        }
        else {
            history.push("/cohorts")
            new Toast("You have not joined a cohort. Please choose one.", Toast.TYPE_WARNING, Toast.TIME_NORMAL);
        }
    }, [])

    const mapConverter = ([groupNumber, arrayOfStudents]) => ({ groupNumber, arrayOfStudents })

    const stageGrouping = ({ groupNumber, arrayOfStudents }) => {
        const heading = {
            0: "Submitted",
            1: "Being Reviewed",
            2: "Requires Changes",
            3: "Approved",
            4: "Not Submitted",
            5: "MVP"
        }[groupNumber]

        // Sort student alphabetically by first name
        arrayOfStudents.sort(
            (c, n) => {
                if (c.name < n.name) return -1;
                if (c.name > n.name) return 1;
                return 0;
            }
        )

        return <div key={`group--${groupNumber}`}>
            <header className="group__heading">
                <h3>{heading}</h3>
                <div className="group__count">
                    <PeopleIcon /> {arrayOfStudents.length}
                </div>
            </header>
            <div className="group">

                {
                    arrayOfStudents.map(student => {
                        const currentProposal = student.proposals.find(p => p?.course_name === activeCourse.name)

                        return <div key={`student--${student.id}`} className="student__row">
                            <div>{student.name}</div>
                            <div>
                                {
                                    groupNumber === 5 || groupNumber === 4
                                        ? ""
                                        : <select value={currentProposal?.current_status_id ?? 0}
                                            onChange={(evt) => {
                                                addToProposalTimeline(currentProposal.id, parseInt(evt.target.value))
                                                    .then(() => getCohortStudents(activeCohort))
                                            }}
                                        >
                                            <option value="0">-- choose status --</option>
                                            {
                                                proposalStatuses.map(s => <option key={`status--${s.id}`} value={s.id}>{s.status}</option>)
                                            }
                                        </select>
                                }
                            </div>
                            <div className="proposalLinks">
                                {
                                    student.proposals.map(proposal => {
                                        return <a target="_blank" key={`proposal--${proposal.id}`} className="proposal__link" href={proposal?.proposal_url}>{proposal.course_name}</a>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    }


    return <section className="students--capstone">
        <div className="capstoneHeader sticky">
            <h4>Student</h4>
            <h4>Options</h4>
            <h4>Proposal Links</h4>
        </div>
        {
            groupedProposals.size === 0
                ? <Loading />
                : Array.from(groupedProposals, mapConverter).map(stageGrouping)
        }
    </section>
}
