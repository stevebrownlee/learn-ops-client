import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const CohortContext = React.createContext()

export const CohortProvider = (props) => {
    const [cohorts, setCohorts] = useState([])
    const [activeCohort, activateCohort] = useState(0)
    const [activeCohortDetails, setCohortDetails] = useState({})

    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getCohorts = useCallback((options={}) => {
        const limit = options.limit ? `?limit=${options.limit}` : ""

        return fetchIt(`${Settings.apiHost}/cohorts${limit}`)
            .then(data => setCohorts(data))
    }, [setCohorts])

    const getCohort = useCallback((id) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${id}`)
            .then((cohort) => {
                setCohortDetails(cohort)
                activateCohort(cohort.id)
            })
    }, [user])

    const leaveCohort = useCallback((cohortId) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${cohortId}/assign?userType=instructor`, { method: "DELETE" })
    }, [])

    const joinCohort = useCallback((cohortId) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${cohortId}/assign?userType=instructor`, { method: "POST" })
    }, [])

    const updateCohort = (cohort) => {
        return fetchIt(
            `${Settings.apiHost}/cohorts/${cohort.id}`,
            { method: "PUT", body: JSON.stringify(cohort) }
        )
    }

    const findCohort = useCallback((q) => {
        return fetchIt(`${Settings.apiHost}/cohorts?q=${q}`)
    }, [user])

    return (
        <CohortContext.Provider value={{
            getCohorts, cohorts, findCohort, activeCohort, activateCohort, getCohort,
            leaveCohort, joinCohort, updateCohort, activeCohortDetails
        }} >
            {props.children}
        </CohortContext.Provider>
    )
}
