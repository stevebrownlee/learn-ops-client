import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const PeopleContext = React.createContext()

export const PeopleProvider = (props) => {
    const [students, setStudents] = useState([])
    const [cohortStudents, setCohortStudents] = useState([])
    const [activeStudent, activateStudent] = useState({})
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getStudents = useCallback((status = "") => {
        return fetchIt(`${Settings.apiHost}/students${status !== "" ? `?status=${status}` : ""}`)
            .then(data => setStudents(data.results))
    }, [user])

    const getCohortStudents = useCallback((cohortId) => {
        return fetchIt(`${Settings.apiHost}/students?cohort=${cohortId}`)
            .then(data => setCohortStudents(data.results))
    }, [user])

    const getStudent = useCallback((id = null) => {
        let studentId = 0
        if (id && Number.isFinite(id)) {
            studentId = id
        }
        else if (!id && !("id" in activeStudent)) {
            throw "No active student"
        }
        else if ("id" in activeStudent) {
            studentId = activeStudent.id
        }
        return fetchIt(`${Settings.apiHost}/students/${studentId}`)
            .then(activateStudent)
    }, [user])

    const getStudentRepos = useCallback(() => {
        return fetchIt(`${activeStudent.github.repos}?sort=updated&direction=desc`)
            .then(activateStudent)
    }, [user])

    const getStudentProposals = useCallback(() => {
        return fetchIt(`${Settings.apiHost}/proposals?studentId=${studentId}`)
            .then(activateStudent)
    }, [user])

    const findStudent = useCallback((q) => {
        return fetchIt(`${Settings.apiHost}/students?q=${q}`)
    }, [user])

    const submitClientProposal = useCallback((q) => {
        return fetchIt(`${Settings.apiHost}/proposal?course=javascript`)
    }, [user])

    return (
        <PeopleContext.Provider value={{
            getStudents, students, findStudent, getStudent,
            activeStudent, activateStudent, getCohortStudents,
            cohortStudents
        }} >
            {props.children}
        </PeopleContext.Provider>
    )
}
