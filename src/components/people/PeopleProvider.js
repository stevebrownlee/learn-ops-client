import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const PeopleContext = React.createContext()

export const PeopleProvider = (props) => {
    const [students, setStudents] = useState([])
    const [cohortStudents, setCohortStudents] = useState([])
    const [activeStudent, activateStudent] = useState({})
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getStudents = useCallback((status = "") => {
        return fetch(`${Settings.apiHost}/students${status !== "" ? `?status=${status}` : ""}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error(`HTTP status ${response.status}`)
                }
            })
            .then(data => setStudents(data.results))
            .catch(console.error)
    }, [user])

    const getCohortStudents = useCallback((cohortId) => {
        return fetch(`${Settings.apiHost}/students?cohort=${cohortId}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setCohortStudents(data))
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
        return fetch(`${Settings.apiHost}/students/${studentId}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(activateStudent)
    }, [user])

    const getStudentRepos = useCallback(() => {
        return fetch(`${activeStudent.github.repos}?sort=updated&direction=desc`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(activateStudent)
    }, [user])

    const findStudent = useCallback((q) => {
        return fetch(`${Settings.apiHost}/students?q=${q}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error(`HTTP status ${response.status}`)
                }
            })
            .catch(console.error)
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
