import React, { useCallback, useState } from "react"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const AssessmentContext = React.createContext()

export const AssessmentProvider = (props) => {
    const [assessments, setAssessments] = useState([])

    const getAssessments = useCallback((studentId=null) => {
        return fetch(`${Settings.apiHost}/assessments${studentId === null ? "" : `?studentId=${studentId}`}`)
            .then(response => response.json())
            .then(data => setAssessments(data))
    }, [setAssessments])

    const saveAssessment = (assessment) => {
        return fetchIt(
            `${Settings.apiHost}/assessments`,
            { method: "POST", body: JSON.stringify(assessment)}
        )
    }
    return (
        <AssessmentContext.Provider value={{
            getAssessments, assessments, saveAssessment
        }} >
            {props.children}
        </AssessmentContext.Provider>
    )
}
