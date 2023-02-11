import React, { useCallback, useEffect, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const CohortContext = React.createContext()

export const CohortProvider = (props) => {
    const [cohorts, setCohorts] = useState([])
    const [activeCohort, activateCohort] = useState(null)
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
                return cohort
            })
    }, [user])

    const getCohortInfo = (id) => {
        return fetchIt(`${Settings.apiHost}/cohortinfo/${id}`)
    }

    const saveCohortInfo = useCallback((urls) => {
        return fetchIt(`${Settings.apiHost}/cohortinfo`, {
            method: "POST",
            body: JSON.stringify(urls)
        })
    }, [])

    const updateCohortInfo = useCallback((id, urls) => {
        return fetchIt(`${Settings.apiHost}/cohortinfo/${id}`, {
            method: "PUT",
            body: JSON.stringify(urls)
        })
    }, [])

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
            leaveCohort, joinCohort, updateCohort, activeCohortDetails, getCohortInfo,
            setCohortDetails, saveCohortInfo, updateCohortInfo
        }} >
            {props.children}
        </CohortContext.Provider>
    )
}
