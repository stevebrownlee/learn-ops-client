import React, { useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const PeopleContext = React.createContext()

export const PeopleProvider = (props) => {
    const [ students, setStudents ] = useState([])
    const [ activeStudent, activateStudent ] = useState({})
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getStudents = () => {
        return fetch(`${Settings.apiHost}/students`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setStudents(data))
    }

    const getStudent = (id) => {
        return fetch(`${Settings.apiHost}/students/${id}`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(activateStudent)
    }

    const findStudent = (q) => {
        return fetch(`${Settings.apiHost}/students?q=${q}`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
    }

    return (
        <PeopleContext.Provider value={{
            getStudents, students, findStudent, getStudent,
            activeStudent, activateStudent
        }} >
            { props.children }
        </PeopleContext.Provider>
    )
}
