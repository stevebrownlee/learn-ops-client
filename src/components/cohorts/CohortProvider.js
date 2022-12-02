import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const CohortContext = React.createContext()

export const CohortProvider = (props) => {
    const [cohorts, setCohorts] = useState([])
    const [activeCohort, activateCohort] = useState({})

    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getCohorts = useCallback((options={}) => {
        const limit = options.limit ? `?limit=${options.limit}` : ""

        return fetch(`${Settings.apiHost}/cohorts${limit}`)
            .then(response => response.json())
            .then(data => setCohorts(data))
    }, [setCohorts])

    const getCohort = useCallback((id) => {
        return fetch(`${Settings.apiHost}/cohorts/${id}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(activateCohort)
    }, [user])


    const findCohort = useCallback((q) => {
        return fetch(`${Settings.apiHost}/cohorts?q=${q}`, {
            headers: {
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
    }, [user])

    return (
        <CohortContext.Provider value={{
            getCohorts, cohorts, findCohort, activeCohort, activateCohort, getCohort
        }} >
            {props.children}
        </CohortContext.Provider>
    )
}
