import React, { useCallback, useState } from "react"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const AssessmentContext = React.createContext()

export const AssessmentProvider = (props) => {
    const [studentAssessments, setAssessments] = useState([])
    const [cohortCapstones, setCohortCapstones] = useState([])
    const [allAssessments, setAll] = useState([])
    const [statuses, setStatuses] = useState([])
    const [proposalStatuses, setProposalStatuses] = useState([])

    const getStudentAssessments = useCallback((studentId) => {
        return fetch(`${Settings.apiHost}/assessments?studentId=${studentId}`)
            .then(response => response.json())
            .then(data => {
                data.sort((c, n) => c.status - n.status ? 1 : -1)
                setAssessments(data)
            })
    }, [setAssessments])

    const getCohortCapstones = useCallback((cohortId) => {
        return fetchIt(`${Settings.apiHost}/capstones?cohortId=${cohortId}`)
            .then(setCohortCapstones)
    }, [])

    const getAssessmentList = useCallback(() => {
        return fetch(`${Settings.apiHost}/assessments`)
            .then(response => response.json())
            .then(setAll)
    }, [setAssessments])

    const getAssessment = id => fetchIt(`${Settings.apiHost}/bookassessments/${id}`)

    const getBookAssessment = bookId => fetchIt(`${Settings.apiHost}/bookassessments?bookId=${bookId}`)

    const saveAssessment = (assessment) => {
        return fetchIt(
            `${Settings.apiHost}/assessments`,
            { method: "POST", body: JSON.stringify(assessment) }
        )
    }

    const saveProposal = (proposal) => {
        return fetchIt(
            `${Settings.apiHost}/capstones`,
            { method: "POST", body: JSON.stringify(proposal) }
        )
    }

    const deleteSelfAssessment = (assessmentId) => {
        return fetchIt(
            `${Settings.apiHost}/assessments/${assessmentId}`,
            { method: "DELETE" }
        )
    }

    const getCourses = () => {
        return fetchIt(`${Settings.apiHost}/courses`)
    }

    const changeStatus = (assessmentId, statusId) => {
        return fetchIt(
            `${Settings.apiHost}/assessments/${assessmentId}`,
            { method: "PUT", body: JSON.stringify({ status: statusId }) }
        )
    }

    const editAssessment = (assessment) => {
        return fetchIt(
            `${Settings.apiHost}/bookassessments/${assessment.id}`,
            { method: "PUT", body: JSON.stringify(assessment) }
        )
    }

    const addToProposalTimeline = (capstoneId, statusId) => {
        return fetchIt(
            `${Settings.apiHost}/timelines`,
            {
                method: "POST",
                body: JSON.stringify({
                    capstone: capstoneId,
                    status: statusId
                })
            }
        )
    }

    const getStatuses = () => {
        return fetchIt(`${Settings.apiHost}/statuses`)
            .then(res => setStatuses(res.results))
    }

    const getProposalStatuses = () => {
        return fetchIt(`${Settings.apiHost}/proposalstatuses`)
            .then(res => setProposalStatuses(res.results))
    }

    const saveStudentAssessment = (assessmentId, studentId) => {
        return fetchIt(
            `${Settings.apiHost}/assessments`,
            {
                method: "POST",
                body: JSON.stringify({ studentId, assessmentId })
            }
        )
    }

    const revokeApproval = (status) => {
        return fetchIt( `${Settings.apiHost}/timelines/${status.id}`, { method: "DELETE" } )
    }

    return (
        <AssessmentContext.Provider value={{
            getStudentAssessments, getAssessmentList, studentAssessments,
            saveAssessment, allAssessments, saveStudentAssessment,
            getStatuses, statuses, changeStatus, getCourses, saveProposal,
            proposalStatuses, getProposalStatuses, addToProposalTimeline,
            cohortCapstones, getCohortCapstones, revokeApproval, deleteSelfAssessment,
            getAssessment, editAssessment, getBookAssessment
        }} >
            {props.children}
        </AssessmentContext.Provider>
    )
}
