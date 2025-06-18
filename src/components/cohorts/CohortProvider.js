import React, { useCallback, useEffect, useState } from "react"
import simpleAuth from "../auth/simpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const CohortContext = React.createContext()

export const CohortProvider = (props) => {
    const [cohorts, setCohorts] = useState([])
    const [activeCohort, activateCohort] = useState(null)
    const [activeCohortDetails, setCohortDetails] = useState({
        start_date: "",
        end_date: "",
        cohort: {
            active: false
        }
    })

    const { getCurrentUser } = simpleAuth()
    const user = getCurrentUser()

    useEffect(() => {
        if (activeCohort && !("id" in activeCohortDetails)) {
            getCohort(activeCohort)
        }
    }, [activeCohort])

    const getCohorts = useCallback((options={}) => {
        const url = `${Settings.apiHost}/cohorts`
        // If options has a `limit` property, append it to the URL
        const queryParams = new Set()
        const limit = options.limit && queryParams.add(`limit=${options.limit}`)
        // If options has an `active` property, append it to the URL
        const active = options.active && queryParams.add(`active=${options.active}`)


        return fetchIt(`${Settings.apiHost}/cohorts${queryParams.size ? `?${[...queryParams].join("&")}` : ""}`)
            .then(data => setCohorts(data))
    }, [setCohorts])

    const getCohort = (id) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${id}`)
            .then((cohort) => {
                setCohortDetails(cohort)
                return cohort
            })
    }

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
        return fetchIt(`${Settings.apiHost}/cohorts?q=${q}&active=true`)
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
