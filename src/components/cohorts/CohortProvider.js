import React, { useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const CohortContext = React.createContext()

export const CohortProvider = (props) => {
    const [ cohorts, setCohorts ] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getCohorts = () => {
        return fetch(`${Settings.apiHost}/cohorts`)
            .then(response => response.json())
            .then(data => setCohorts(data))
    }

    return (
        <CohortContext.Provider value={{
            getCohorts, cohorts
        }} >
            { props.children }
        </CohortContext.Provider>
    )
}
