import React, { useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const PeopleContext = React.createContext()

export const PeopleProvider = (props) => {
    const [ students, setStudents ] = useState([])
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

    return (
        <PeopleContext.Provider value={{
            getStudents, students
        }} >
            { props.children }
        </PeopleContext.Provider>
    )
}
