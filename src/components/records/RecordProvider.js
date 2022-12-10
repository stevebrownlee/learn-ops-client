import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const RecordContext = React.createContext()

export const RecordProvider = (props) => {
    const [records, setRecords] = useState([])
    const [weights, setWeights] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getWeights = useCallback((studentId = null) => {
        return fetchIt(`${Settings.apiHost}/weights${studentId ? `?studentId=${studentId}` : ""}`)
            .then(setWeights)
    }, [])

    const getRecords = () => {
        return fetchIt(`${Settings.apiHost}/records`)
            .then(setRecords)
    }

    const deleteRecordEntry = (id) => {
        return fetchIt(`${Settings.apiHost}/records/entries/${id}`, {
            method: "DELETE",
        })
    }

    const createRecordEntry = (record) => {
        return fetch(`${Settings.apiHost}/records/entries`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        })
    }

    const getRecord = useCallback((id) => {
        return fetchIt(`${Settings.apiHost}/records/${id}`)
    }, [])

    const createRecord = record => {
        return fetchIt(`${Settings.apiHost}/records`, {
            method: "POST",
            body: JSON.stringify(record)
        })
    }

    const updateRecord = record => {
        return fetchIt(`${Settings.apiHost}/records/${record.id}`, {
            method: "PUT",
            body: JSON.stringify(record)
        })
    }

    return (
        <RecordContext.Provider value={{
            getWeights, getRecords, weights, records, updateRecord,
            createRecord, deleteRecordEntry, getRecord, createRecordEntry
        }} >
            {props.children}
        </RecordContext.Provider>
    )
}
