import React, { useCallback, useState } from "react"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const AssessmentContext = React.createContext()

export const AssessmentProvider = (props) => {
    const [studentAssessments, setAssessments] = useState([])
    const [allAssessments, setAll] = useState([])
    const [statuses, setStatuses] = useState([])

    const getStudentAssessments = useCallback((studentId) => {
        return fetch(`${Settings.apiHost}/assessments?studentId=${studentId}`)
            .then(response => response.json())
            .then(data => {
                data.sort( (c, n) => c.status - n.status ? 1 : -1 )
                setAssessments(data)
            })
    }, [setAssessments])

    const getAssessmentList = useCallback(() => {
        return fetch(`${Settings.apiHost}/assessments`)
            .then(response => response.json())
            .then(setAll)
    }, [setAssessments])

    const saveAssessment = (assessment) => {
        return fetchIt(
            `${Settings.apiHost}/assessments`,
            { method: "POST", body: JSON.stringify(assessment)}
        )
    }

    const changeStatus = (assessmentId, statusId) => {
        return fetchIt(
            `${Settings.apiHost}/assessments/${assessmentId}`,
            { method: "PUT", body: JSON.stringify({ status: statusId})}
        )
    }

    const getStatuses = () => {
        return fetchIt(`${Settings.apiHost}/statuses`)
            .then(res => setStatuses(res.results))
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

    return (
        <AssessmentContext.Provider value={{
            getStudentAssessments, getAssessmentList, studentAssessments,
            saveAssessment, allAssessments, saveStudentAssessment,
            getStatuses, statuses, changeStatus
        }} >
            {props.children}
        </AssessmentContext.Provider>
    )
}
